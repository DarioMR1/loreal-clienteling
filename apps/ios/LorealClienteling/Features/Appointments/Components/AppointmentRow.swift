import SwiftUI

/// A single appointment row in the list.
struct AppointmentRow: View {
    let appointment: Appointment
    let isSelected: Bool

    var body: some View {
        HStack(spacing: LorealSpacing.sm) {
            // Time column
            VStack(spacing: 2) {
                Text(appointment.timeFormatted)
                    .font(LorealTypography.kpiSmall)
                    .foregroundStyle(LorealColors.accent)
                Text("\(appointment.durationMinutes) min")
                    .font(LorealTypography.caption)
                    .foregroundStyle(LorealColors.textTertiary)
            }
            .frame(width: 65)

            Divider()
                .frame(height: 44)

            // Info
            VStack(alignment: .leading, spacing: LorealSpacing.xxs) {
                Text(appointment.eventTypeDisplayName)
                    .font(LorealTypography.headline)
                    .foregroundStyle(LorealColors.textPrimary)

                if let date = appointment.scheduledDate {
                    Text(date.shortFormatted)
                        .font(LorealTypography.footnote)
                        .foregroundStyle(LorealColors.textSecondary)
                }

                if appointment.isVirtual {
                    HStack(spacing: 4) {
                        Image(systemName: "video.fill")
                            .font(.caption2)
                        Text("Virtual")
                            .font(LorealTypography.caption)
                    }
                    .foregroundStyle(LorealColors.info)
                }
            }

            Spacer()

            // Status badge
            LorealBadge(
                text: appointment.statusDisplayName,
                style: badgeStyle(appointment.status)
            )
        }
        .padding(.vertical, LorealSpacing.xs)
        .padding(.horizontal, LorealSpacing.sm)
        .background(isSelected ? LorealColors.accent.opacity(0.08) : Color.clear)
        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        .contentShape(Rectangle())
    }

    private func badgeStyle(_ status: String) -> LorealBadge.BadgeStyle {
        switch status {
        case "confirmed": .success
        case "scheduled": .info
        case "completed": .accent
        case "rescheduled": .warning
        case "cancelled", "no_show": .error
        default: .info
        }
    }
}
