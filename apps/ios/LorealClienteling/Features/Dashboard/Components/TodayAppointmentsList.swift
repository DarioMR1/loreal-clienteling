import SwiftUI

/// Shows today's upcoming appointments on the dashboard.
struct TodayAppointmentsList: View {
    let appointments: [DashboardAppointment]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            LorealSectionHeader(title: "Citas de hoy", actionLabel: "Ver todas") {
                // Navigate to appointments section — handled by parent
            }

            if appointments.isEmpty {
                LorealCard {
                    HStack(spacing: LorealSpacing.sm) {
                        Image(systemName: "calendar.badge.checkmark")
                            .font(.title3)
                            .foregroundStyle(LorealColors.success)
                        Text("No hay citas programadas para hoy")
                            .font(LorealTypography.callout)
                            .foregroundStyle(LorealColors.textSecondary)
                    }
                }
                .padding(.horizontal, LorealSpacing.screenPadding)
            } else {
                VStack(spacing: LorealSpacing.xs) {
                    ForEach(appointments) { appointment in
                        appointmentRow(appointment)
                    }
                }
                .padding(.horizontal, LorealSpacing.screenPadding)
            }
        }
    }

    private func appointmentRow(_ appointment: DashboardAppointment) -> some View {
        LorealCard {
            HStack(spacing: LorealSpacing.sm) {
                // Time
                VStack {
                    Text(appointment.time)
                        .font(LorealTypography.kpiSmall)
                        .foregroundStyle(LorealColors.accent)
                }
                .frame(width: 60)

                Divider()
                    .frame(height: 40)

                // Info
                VStack(alignment: .leading, spacing: LorealSpacing.xxs) {
                    Text(appointment.customerName)
                        .font(LorealTypography.headline)
                        .foregroundStyle(LorealColors.textPrimary)
                    Text(appointment.eventType)
                        .font(LorealTypography.footnote)
                        .foregroundStyle(LorealColors.textSecondary)
                }

                Spacer()

                LorealBadge(
                    text: appointment.statusLabel,
                    style: appointment.statusStyle
                )
            }
        }
    }
}

/// Lightweight model for dashboard appointment display.
struct DashboardAppointment: Identifiable, Sendable {
    let id: String
    let time: String
    let customerName: String
    let eventType: String
    let status: String

    var statusLabel: String {
        switch status {
        case "scheduled": "Programada"
        case "confirmed": "Confirmada"
        case "completed": "Completada"
        case "cancelled": "Cancelada"
        case "no_show": "No asistió"
        default: status
        }
    }

    var statusStyle: LorealBadge.BadgeStyle {
        switch status {
        case "confirmed": .success
        case "scheduled": .info
        case "completed": .accent
        case "cancelled", "no_show": .error
        default: .info
        }
    }
}

#Preview {
    TodayAppointmentsList(appointments: [
        DashboardAppointment(id: "1", time: "10:00", customerName: "María López", eventType: "Facial express", status: "confirmed"),
        DashboardAppointment(id: "2", time: "14:30", customerName: "Ana García", eventType: "Cabina VIP", status: "scheduled"),
    ])
    .background(LorealColors.background)
}
