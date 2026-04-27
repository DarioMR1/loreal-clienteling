import SwiftUI

/// KPI display card for dashboard metrics.
struct LorealKPICard: View {
    let title: String
    let value: String
    var subtitle: String?
    var icon: String?
    var trend: Trend?

    enum Trend {
        case up(String)
        case down(String)
        case neutral(String)

        var color: Color {
            switch self {
            case .up: LorealColors.success
            case .down: LorealColors.error
            case .neutral: LorealColors.textTertiary
            }
        }

        var icon: String {
            switch self {
            case .up: "arrow.up.right"
            case .down: "arrow.down.right"
            case .neutral: "minus"
            }
        }

        var text: String {
            switch self {
            case .up(let t), .down(let t), .neutral(let t): t
            }
        }
    }

    var body: some View {
        LorealCard {
            VStack(alignment: .leading, spacing: LorealSpacing.xs) {
                HStack {
                    if let icon {
                        Image(systemName: icon)
                            .font(LorealTypography.callout)
                            .foregroundStyle(LorealColors.accent)
                    }
                    Text(title)
                        .font(LorealTypography.caption)
                        .foregroundStyle(LorealColors.textSecondary)
                }

                Text(value)
                    .font(LorealTypography.kpiLarge)
                    .foregroundStyle(LorealColors.textPrimary)
                    .accessibilityValue(value)

                if let subtitle {
                    Text(subtitle)
                        .font(LorealTypography.footnote)
                        .foregroundStyle(LorealColors.textSecondary)
                }

                if let trend {
                    HStack(spacing: 4) {
                        Image(systemName: trend.icon)
                            .font(.caption2)
                        Text(trend.text)
                            .font(LorealTypography.caption)
                    }
                    .foregroundStyle(trend.color)
                }
            }
        }
    }
}

#Preview {
    HStack {
        LorealKPICard(
            title: "Ventas hoy",
            value: "$12,450",
            subtitle: "Meta: $15,000",
            icon: "dollarsign.circle",
            trend: .up("+8% vs ayer")
        )
        LorealKPICard(
            title: "Clientas atendidas",
            value: "7",
            icon: "person.2"
        )
    }
    .padding()
    .background(LorealColors.background)
}
