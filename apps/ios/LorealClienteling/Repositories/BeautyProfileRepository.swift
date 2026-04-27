import Foundation

/// Repository wrapping beauty profile API endpoints.
struct BeautyProfileRepository: Sendable {
    private let token: String

    init(token: String) {
        self.token = token
    }

    /// Fetches the beauty profile for a customer. Returns nil if not found.
    func findProfile(customerId: String) async throws -> BeautyProfile? {
        let url = ServerConfig.baseURL.appendingPathComponent("customers/\(customerId)/beauty-profile")
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw APIError.unknown("Respuesta inválida")
        }

        // 200 with empty body or "null" means no profile
        if http.statusCode == 404 || data.isEmpty {
            return nil
        }

        guard (200...299).contains(http.statusCode) else {
            throw APIError.from(statusCode: http.statusCode)
        }

        // API may return null for no profile
        let decoded = try? JSONDecoder().decode(BeautyProfile.self, from: data)
        return decoded
    }

    /// Creates or updates the beauty profile.
    func upsert(_ body: UpsertBeautyProfileBody) async throws -> BeautyProfile {
        let url = ServerConfig.baseURL.appendingPathComponent("customers/\(body.customerId)/beauty-profile")
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            let code = (response as? HTTPURLResponse)?.statusCode ?? 500
            throw APIError.from(statusCode: code)
        }
        return try JSONDecoder().decode(BeautyProfile.self, from: data)
    }
}
