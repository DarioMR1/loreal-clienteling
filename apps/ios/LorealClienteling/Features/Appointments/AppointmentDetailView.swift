import SwiftUI

/// Detail view for a single appointment.
struct AppointmentDetailView: View {
    let appointment: Appointment
    var onStatusChanged: ((String) async -> Void)?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: LorealSpacing.lg) {
                // Header
                LorealCard {
                    VStack(alignment: .leading, spacing: LorealSpacing.md) {
                        HStack {
                            Text(appointment.eventTypeDisplayName)
                                .font(LorealTypography.brandTitle)
                                .foregroundStyle(LorealColors.textPrimary)
                            Spacer()
                            LorealBadge(
                                text: appointment.statusDisplayName,
                                style: statusBadgeStyle
                            )
                        }

                        Divider()

                        // Details
                        detailRow(icon: "calendar", label: "Fecha", value: appointment.scheduledDate?.longFormatted ?? "—")
                        detailRow(icon: "clock", label: "Hora", value: appointment.timeFormatted)
                        detailRow(icon: "timer", label: "Duración", value: "\(appointment.durationMinutes) minutos")

                        if appointment.isVirtual {
                            detailRow(icon: "video.fill", label: "Tipo", value: "Virtual")
                            if let link = appointment.videoLink {
                                detailRow(icon: "link", label: "Enlace", value: link)
                            }
                        }

                        if let comments = appointment.comments, !comments.isEmpty {
                            VStack(alignment: .leading, spacing: LorealSpacing.xxs) {
                                Text("Comentarios")
                                    .font(LorealTypography.footnote)
                                    .foregroundStyle(LorealColors.textSecondary)
                                Text(comments)
                                    .font(LorealTypography.body)
                                    .foregroundStyle(LorealColors.textPrimary)
                            }
                        }
                    }
                }
                .padding(.horizontal, LorealSpacing.screenPadding)

                // Action buttons
                if appointment.status == "scheduled" || appointment.status == "confirmed" {
                    LorealSectionHeader(title: "Acciones")

                    HStack(spacing: LorealSpacing.sm) {
                        if appointment.status == "scheduled" {
                            actionButton("Confirmar", icon: "checkmark.circle", color: LorealColors.success) {
                                await onStatusChanged?("confirmed")
                            }
                        }
                        actionButton("Completar", icon: "checkmark.circle.fill", color: LorealColors.accent) {
                            await onStatusChanged?("completed")
                        }
                        actionButton("Cancelar", icon: "xmark.circle", color: LorealColors.error) {
                            await onStatusChanged?("cancelled")
                        }
                        actionButton("No asistió", icon: "person.slash", color: LorealColors.warning) {
                            await onStatusChanged?("no_show")
                        }
                    }
                    .padding(.horizontal, LorealSpacing.screenPadding)
                }

                Spacer(minLength: LorealSpacing.xxl)
            }
            .padding(.vertical, LorealSpacing.md)
        }
        .background(LorealColors.background)
        .navigationTitle("Detalle de cita")
    }

    private func detailRow(icon: String, label: String, value: String) -> some View {
        HStack(spacing: LorealSpacing.xs) {
            Image(systemName: icon)
                .font(.callout)
                .foregroundStyle(LorealColors.accent)
                .frame(width: 24)
            Text(label)
                .font(LorealTypography.footnote)
                .foregroundStyle(LorealColors.textSecondary)
                .frame(width: 80, alignment: .leading)
            Text(value)
                .font(LorealTypography.callout)
                .foregroundStyle(LorealColors.textPrimary)
        }
    }

    private func actionButton(_ label: String, icon: String, color: Color, action: @escaping () async -> Void) -> some View {
        Button {
            Task { await action() }
        } label: {
            VStack(spacing: LorealSpacing.xxs) {
                Image(systemName: icon)
                    .font(.title3)
                Text(label)
                    .font(LorealTypography.caption)
            }
            .foregroundStyle(color)
            .frame(maxWidth: .infinity)
            .frame(height: LorealSpacing.touchTarget)
            .background(color.opacity(0.08))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
        .buttonStyle(.plain)
    }

    private var statusBadgeStyle: LorealBadge.BadgeStyle {
        switch appointment.status {
        case "confirmed": .success
        case "scheduled": .info
        case "completed": .accent
        case "rescheduled": .warning
        case "cancelled", "no_show": .error
        default: .info
        }
    }
}
