import Foundation

/// Manages authentication state: sign-in via Better Auth, token persistence, and session.
@MainActor
@Observable
final class AuthManager {
    private(set) var isAuthenticated = false
    private(set) var isLoading = false
    private(set) var errorMessage: String?

    private(set) var currentUser: SessionUser?

    private static let tokenKey = "auth_token"

    init() {
        if let token = KeychainService.read(key: Self.tokenKey) {
            isAuthenticated = true
            Task { await fetchSession(token: token) }
        }
    }

    func signIn(email: String, password: String) async {
        isLoading = true
        errorMessage = nil

        do {
            var request = URLRequest(url: baseURL.appendingPathComponent("api/auth/sign-in/email"))
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue(baseURL.absoluteString, forHTTPHeaderField: "Origin")

            let body = ["email": email, "password": password]
            request.httpBody = try JSONEncoder().encode(body)

            let (data, response) = try await URLSession.shared.data(for: request)

            guard let http = response as? HTTPURLResponse else {
                throw AuthError.invalidResponse
            }

            if let token = http.value(forHTTPHeaderField: "set-auth-token") {
                try KeychainService.save(key: Self.tokenKey, value: token)
                await fetchSession(token: token)
                isAuthenticated = true
            } else if (200...299).contains(http.statusCode) {
                let decoded = try JSONDecoder().decode(AuthTokenResponse.self, from: data)
                try KeychainService.save(key: Self.tokenKey, value: decoded.token)
                await fetchSession(token: decoded.token)
                isAuthenticated = true
            } else {
                let error = try? JSONDecoder().decode(AuthErrorResponse.self, from: data)
                errorMessage = error?.message ?? "Error al iniciar sesión"
            }
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    func signOut() {
        KeychainService.delete(key: Self.tokenKey)
        currentUser = nil
        isAuthenticated = false
    }

    var token: String? {
        KeychainService.read(key: Self.tokenKey)
    }

    // MARK: - Private

    private var baseURL: URL {
        if let override = ProcessInfo.processInfo.environment["API_BASE_URL"],
           let url = URL(string: override) {
            return url
        }
        #if DEBUG
        return URL(string: "http://localhost:3001")!
        #else
        return URL(string: "https://api.example.com")!
        #endif
    }

    private func fetchSession(token: String) async {
        var request = URLRequest(url: baseURL.appendingPathComponent("api/auth/get-session"))
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue(baseURL.absoluteString, forHTTPHeaderField: "Origin")

        guard let (data, response) = try? await URLSession.shared.data(for: request),
              let http = response as? HTTPURLResponse,
              (200...299).contains(http.statusCode) else {
            return
        }

        currentUser = try? JSONDecoder().decode(SessionResponse.self, from: data).user
    }
}

// MARK: - Models

struct SessionUser: Codable, Sendable {
    let id: String
    let email: String
    let role: String
    let fullName: String
    let storeId: String?
    let brandId: String?
    let zoneId: String?
    let active: Bool
}

private struct SessionResponse: Codable, Sendable {
    let user: SessionUser
}

private struct AuthTokenResponse: Codable, Sendable {
    let token: String
}

private struct AuthErrorResponse: Codable, Sendable {
    let message: String?
}

enum AuthError: Error, LocalizedError {
    case invalidResponse

    var errorDescription: String? {
        switch self {
        case .invalidResponse: "Respuesta inválida del servidor"
        }
    }
}
