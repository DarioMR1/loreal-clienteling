import Foundation

/// Repository wrapping appointment API endpoints.
struct AppointmentRepository: Sendable {
    private let token: String

    init(token: String) {
        self.token = token
    }

    func findAll(from: String? = nil, to: String? = nil) async throws -> [Appointment] {
        var components = URLComponents(url: ServerConfig.baseURL.appendingPathComponent("appointments"), resolvingAgainstBaseURL: false)!
        var queryItems: [URLQueryItem] = []
        if let from { queryItems.append(URLQueryItem(name: "from", value: from)) }
        if let to { queryItems.append(URLQueryItem(name: "to", value: to)) }
        if !queryItems.isEmpty { components.queryItems = queryItems }

        return try await get(components.url!)
    }

    func findOne(id: String) async throws -> Appointment {
        let url = ServerConfig.baseURL.appendingPathComponent("appointments/\(id)")
        return try await get(url)
    }

    func create(_ body: CreateAppointmentBody) async throws -> Appointment {
        let url = ServerConfig.baseURL.appendingPathComponent("appointments")
        return try await post(url, body: body)
    }

    func update(id: String, _ body: UpdateAppointmentBody) async throws -> Appointment {
        let url = ServerConfig.baseURL.appendingPathComponent("appointments/\(id)")
        return try await patch(url, body: body)
    }

    // MARK: - HTTP Helpers

    private func get<T: Decodable>(_ url: URL) async throws -> T {
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        let (data, response) = try await URLSession.shared.data(for: request)
        try validate(response)
        return try JSONDecoder().decode(T.self, from: data)
    }

    private func post<B: Encodable, T: Decodable>(_ url: URL, body: B) async throws -> T {
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)
        let (data, response) = try await URLSession.shared.data(for: request)
        try validate(response)
        return try JSONDecoder().decode(T.self, from: data)
    }

    private func patch<B: Encodable, T: Decodable>(_ url: URL, body: B) async throws -> T {
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)
        let (data, response) = try await URLSession.shared.data(for: request)
        try validate(response)
        return try JSONDecoder().decode(T.self, from: data)
    }

    private func validate(_ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw APIError.from(statusCode: (response as? HTTPURLResponse)?.statusCode ?? 500)
        }
    }
}
