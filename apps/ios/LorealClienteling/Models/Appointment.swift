import SwiftUI

/// Appointment model matching the Drizzle schema response.
struct Appointment: Codable, Identifiable, Sendable {
    let id: String
    let customerId: String
    let baUserId: String
    let storeId: String
    let eventType: String
    let scheduledAt: String
    let durationMinutes: Int
    let status: String
    let comments: String?
    let reminderSentAt: String?
    let confirmationSentAt: String?
    let isVirtual: Bool
    let videoLink: String?
    let rescheduledFromAppointmentId: String?
    let createdAt: String?
    let updatedAt: String?

    var scheduledDate: Date? {
        ISO8601DateFormatter().date(from: scheduledAt)
    }

    var statusDisplayName: String {
        switch status {
        case "scheduled": "Programada"
        case "confirmed": "Confirmada"
        case "rescheduled": "Reagendada"
        case "cancelled": "Cancelada"
        case "completed": "Completada"
        case "no_show": "No asistió"
        default: status
        }
    }

    var statusColor: Color {
        switch status {
        case "scheduled": LorealColors.info
        case "confirmed": LorealColors.success
        case "completed": LorealColors.accent
        case "rescheduled": LorealColors.warning
        case "cancelled", "no_show": LorealColors.error
        default: LorealColors.textTertiary
        }
    }

    var eventTypeDisplayName: String {
        switch eventType {
        case "cabin_service": "Servicio de cabina"
        case "facial": "Facial"
        case "anniversary_event": "Evento aniversario"
        case "vip_cabin": "Cabina VIP"
        case "product_followup": "Seguimiento de producto"
        case "custom": "Personalizado"
        default: eventType
        }
    }

    var timeFormatted: String {
        guard let date = scheduledDate else { return "" }
        return date.timeFormatted
    }
}

/// DTO for creating an appointment.
struct CreateAppointmentBody: Codable, Sendable {
    let customerId: String
    let eventType: String
    let scheduledAt: String
    let durationMinutes: Int
    var comments: String?
    var isVirtual: Bool = false
    var videoLink: String?
}

/// DTO for updating an appointment.
struct UpdateAppointmentBody: Codable, Sendable {
    var status: String?
    var scheduledAt: String?
    var durationMinutes: Int?
    var comments: String?
}
