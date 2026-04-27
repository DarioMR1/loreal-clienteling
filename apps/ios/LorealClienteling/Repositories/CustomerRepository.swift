import Foundation

/// Repository wrapping customer API endpoints via URLSession.
/// The OpenAPI spec lacks response schemas, so we decode JSON manually.
struct CustomerRepository: Sendable {
    private let token: String

    init(token: String) {
        self.token = token
    }

    // MARK: - List & Search

    func findAll(page: Int = 1, limit: Int = 20, segment: String? = nil) async throws -> [Customer] {
        var components = URLComponents(url: ServerConfig.baseURL.appendingPathComponent("customers"), resolvingAgainstBaseURL: false)!
        var queryItems = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)"),
        ]
        if let segment {
            queryItems.append(URLQueryItem(name: "segment", value: segment))
        }
        components.queryItems = queryItems

        return try await get(components.url!)
    }

    func search(query: String, type: String = "name") async throws -> [Customer] {
        var components = URLComponents(url: ServerConfig.baseURL.appendingPathComponent("customers/search"), resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "query", value: query),
            URLQueryItem(name: "type", value: type),
        ]

        // Search endpoint may return ranked results with extra fields — we still decode as Customer
        let data = try await rawGet(components.url!)
        // Try decoding as array of customers first
        if let customers = try? JSONDecoder().decode([Customer].self, from: data) {
            return customers
        }
        // Search returns ranked results with nested customer data
        let ranked = try JSONDecoder().decode([RankedSearchResult].self, from: data)
        return ranked.map(\.customer)
    }

    // MARK: - Detail

    func findOne(id: String) async throws -> Customer {
        let url = ServerConfig.baseURL.appendingPathComponent("customers/\(id)")
        return try await get(url)
    }

    // MARK: - Create & Update

    func create(_ body: CreateCustomerBody) async throws -> Customer {
        let url = ServerConfig.baseURL.appendingPathComponent("customers")
        return try await post(url, body: body)
    }

    func update(id: String, _ body: UpdateCustomerBody) async throws -> Customer {
        let url = ServerConfig.baseURL.appendingPathComponent("customers/\(id)")
        return try await patch(url, body: body)
    }

    // MARK: - HTTP Helpers

    private func get<T: Decodable>(_ url: URL) async throws -> T {
        let data = try await rawGet(url)
        return try JSONDecoder().decode(T.self, from: data)
    }

    private func rawGet(_ url: URL) async throws -> Data {
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
        return data
    }

    private func post<B: Encodable, T: Decodable>(_ url: URL, body: B) async throws -> T {
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)

        let (data, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
        return try JSONDecoder().decode(T.self, from: data)
    }

    private func patch<B: Encodable, T: Decodable>(_ url: URL, body: B) async throws -> T {
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)

        let (data, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
        return try JSONDecoder().decode(T.self, from: data)
    }

    private func validateResponse(_ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse else {
            throw APIError.unknown("Respuesta inválida")
        }
        guard (200...299).contains(http.statusCode) else {
            throw APIError.from(statusCode: http.statusCode)
        }
    }
}

/// Shape from ranked search results endpoint.
private struct RankedSearchResult: Codable, Sendable {
    let customer: Customer
    let finalScore: Double?
}
