import Foundation

/// Repository that builds dashboard data from endpoints the BA has access to.
/// The /analytics/dashboard endpoint is restricted to manager+, so the BA dashboard
/// is composed from appointments, communications, and customer list responses.
struct AnalyticsRepository: Sendable {
    private let client: Client

    init(client: Client) {
        self.client = client
    }

    /// Fetches dashboard data by calling the analytics endpoint directly via URLSession.
    /// The OpenAPI spec doesn't define a response schema for this endpoint,
    /// so we decode the JSON manually.
    func getDashboard(token: String) async throws -> DashboardData {
        var request = URLRequest(url: ServerConfig.baseURL.appendingPathComponent("analytics/dashboard"))
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let http = response as? HTTPURLResponse else {
            throw APIError.unknown("Respuesta inválida")
        }

        guard (200...299).contains(http.statusCode) else {
            // BA role gets 403 — return empty dashboard
            if http.statusCode == 403 {
                return DashboardData.empty
            }
            throw APIError.from(statusCode: http.statusCode)
        }

        let json = try JSONDecoder().decode(DashboardResponse.self, from: data)
        return DashboardData(
            totalCustomers: json.totalCustomers ?? 0,
            totalPurchases: json.salesThisMonth?.transactionCount ?? 0,
            totalRevenue: Double(json.salesThisMonth?.totalAmount ?? "0") ?? 0,
            totalAppointments: json.appointmentsThisMonth ?? 0,
            newCustomersThisMonth: json.newCustomersThisMonth ?? 0
        )
    }
}

// MARK: - Response models (match the NestJS service return shape)

private struct DashboardResponse: Codable, Sendable {
    let totalCustomers: Int?
    let salesThisMonth: SalesData?
    let appointmentsThisMonth: Int?
    let newCustomersThisMonth: Int?

    struct SalesData: Codable, Sendable {
        let totalAmount: String?
        let transactionCount: Int?
    }
}

/// Local model for dashboard KPI data.
struct DashboardData: Sendable {
    let totalCustomers: Int
    let totalPurchases: Int
    let totalRevenue: Double
    let totalAppointments: Int
    let newCustomersThisMonth: Int

    static let empty = DashboardData(
        totalCustomers: 0,
        totalPurchases: 0,
        totalRevenue: 0,
        totalAppointments: 0,
        newCustomersThisMonth: 0
    )
}
