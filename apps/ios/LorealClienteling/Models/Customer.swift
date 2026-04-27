import Foundation

/// Customer model matching the Drizzle schema / NestJS response.
/// Drizzle returns camelCase JSON by default.
struct Customer: Codable, Identifiable, Sendable {
    let id: String
    let firstName: String
    let lastName: String
    let email: String?
    let phone: String?
    let gender: String?
    let birthDate: String?
    let registeredAtStoreId: String
    let registeredByUserId: String
    let lastBaUserId: String?
    let customerSince: String?
    let lastContactAt: String?
    let lastTransactionAt: String?
    let lifecycleSegment: String
    let inactive: Bool
    let createdAt: String?
    let updatedAt: String?

    var fullName: String { "\(firstName) \(lastName)" }

    var segmentDisplayName: String {
        switch lifecycleSegment {
        case "new": "Nueva"
        case "returning": "Recurrente"
        case "vip": "VIP"
        case "at_risk": "En riesgo"
        default: lifecycleSegment
        }
    }

    var lastContactDate: Date? {
        guard let lastContactAt else { return nil }
        return ISO8601DateFormatter().date(from: lastContactAt)
    }

    var lastTransactionDate: Date? {
        guard let lastTransactionAt else { return nil }
        return ISO8601DateFormatter().date(from: lastTransactionAt)
    }
}

/// DTO for creating a customer.
struct CreateCustomerBody: Codable, Sendable {
    let firstName: String
    let lastName: String
    var email: String?
    var phone: String?
    var gender: String?
    var birthDate: String?
}

/// DTO for updating a customer.
struct UpdateCustomerBody: Codable, Sendable {
    var firstName: String?
    var lastName: String?
    var email: String?
    var phone: String?
    var gender: String?
    var birthDate: String?
}
