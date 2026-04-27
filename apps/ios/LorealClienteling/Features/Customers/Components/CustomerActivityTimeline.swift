import SwiftUI

/// Activity timeline for the customer 360° profile.
struct CustomerActivityTimeline: View {
    let items: [TimelineItem]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            LorealSectionHeader(title: "Actividad reciente")

            if items.isEmpty {
                LorealCard {
                    HStack {
                        Image(systemName: "clock")
                            .foregroundStyle(LorealColors.textTertiary)
                        Text("Sin actividad registrada")
                            .font(LorealTypography.callout)
                            .foregroundStyle(LorealColors.textSecondary)
                    }
                }
                .padding(.horizontal, LorealSpacing.screenPadding)
            } else {
                LorealTimeline(items: items) { item in
                    VStack(alignment: .leading, spacing: 2) {
                        Text(item.title)
                            .font(LorealTypography.callout)
                            .foregroundStyle(LorealColors.textPrimary)
                        if let subtitle = item.subtitle {
                            Text(subtitle)
                                .font(LorealTypography.footnote)
                                .foregroundStyle(LorealColors.textSecondary)
                        }
                        Text(item.date.relativeFormatted)
                            .font(LorealTypography.caption)
                            .foregroundStyle(LorealColors.textTertiary)
                    }
                }
                .padding(.horizontal, LorealSpacing.screenPadding)
            }
        }
    }
}
