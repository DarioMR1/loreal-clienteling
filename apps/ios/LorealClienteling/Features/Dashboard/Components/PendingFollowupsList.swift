import SwiftUI

/// Shows pending follow-ups on the dashboard.
struct PendingFollowupsList: View {
    let followups: [DashboardFollowup]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            LorealSectionHeader(title: "Seguimientos pendientes", actionLabel: "Ver todos") {
                // Navigate to followups section — handled by parent
            }

            if followups.isEmpty {
                LorealCard {
                    HStack(spacing: LorealSpacing.sm) {
                        Image(systemName: "checkmark.circle")
                            .font(.title3)
                            .foregroundStyle(LorealColors.success)
                        Text("No hay seguimientos pendientes")
                            .font(LorealTypography.callout)
                            .foregroundStyle(LorealColors.textSecondary)
                    }
                }
                .padding(.horizontal, LorealSpacing.screenPadding)
            } else {
                VStack(spacing: LorealSpacing.xs) {
                    ForEach(followups) { followup in
                        followupRow(followup)
                    }
                }
                .padding(.horizontal, LorealSpacing.screenPadding)
            }
        }
    }

    private func followupRow(_ followup: DashboardFollowup) -> some View {
        LorealCard {
            HStack(spacing: LorealSpacing.sm) {
                LorealAvatar(name: followup.customerName, size: .small)

                VStack(alignment: .leading, spacing: LorealSpacing.xxs) {
                    Text(followup.customerName)
                        .font(LorealTypography.headline)
                        .foregroundStyle(LorealColors.textPrimary)
                    Text(followup.reason)
                        .font(LorealTypography.footnote)
                        .foregroundStyle(LorealColors.textSecondary)
                }

                Spacer()

                Image(systemName: followup.channelIcon)
                    .font(.title3)
                    .foregroundStyle(LorealColors.accent)
                    .touchTarget(44)
            }
        }
    }
}

/// Lightweight model for dashboard followup display.
struct DashboardFollowup: Identifiable, Sendable {
    let id: String
    let customerName: String
    let reason: String
    let channel: String

    var channelIcon: String {
        switch channel {
        case "whatsapp": "message.fill"
        case "sms": "text.bubble.fill"
        case "email": "envelope.fill"
        default: "paperplane.fill"
        }
    }
}

#Preview {
    PendingFollowupsList(followups: [
        DashboardFollowup(id: "1", customerName: "Rosa Hernández", reason: "Cumpleaños en 3 días", channel: "whatsapp"),
        DashboardFollowup(id: "2", customerName: "Carmen Ruiz", reason: "Reposición de sérum", channel: "sms"),
    ])
    .background(LorealColors.background)
}
