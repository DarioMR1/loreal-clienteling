import SwiftUI

/// Capsule badge with text and optional SF Symbol.
struct LorealBadge: View {
    let text: String
    var icon: String?
    var style: BadgeStyle = .accent

    enum BadgeStyle {
        case accent, success, warning, error, info, custom(Color)

        var backgroundColor: Color {
            switch self {
            case .accent: LorealColors.accent.opacity(0.15)
            case .success: LorealColors.success.opacity(0.15)
            case .warning: LorealColors.warning.opacity(0.15)
            case .error: LorealColors.error.opacity(0.15)
            case .info: LorealColors.info.opacity(0.15)
            case .custom(let color): color.opacity(0.15)
            }
        }

        var foregroundColor: Color {
            switch self {
            case .accent: LorealColors.accent
            case .success: LorealColors.success
            case .warning: LorealColors.warning
            case .error: LorealColors.error
            case .info: LorealColors.info
            case .custom(let color): color
            }
        }
    }

    var body: some View {
        HStack(spacing: 4) {
            if let icon {
                Image(systemName: icon)
                    .font(.caption2)
            }
            Text(text)
                .font(LorealTypography.caption)
                .fontWeight(.medium)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(style.backgroundColor)
        .foregroundStyle(style.foregroundColor)
        .clipShape(Capsule())
    }

    /// Convenience for lifecycle segment badges.
    static func segment(_ segment: String) -> LorealBadge {
        let displayName: String
        let badgeStyle: BadgeStyle

        switch segment.lowercased() {
        case "new":
            displayName = "Nueva"
            badgeStyle = .custom(LorealColors.segmentNew)
        case "returning":
            displayName = "Recurrente"
            badgeStyle = .custom(LorealColors.segmentReturning)
        case "vip":
            displayName = "VIP"
            badgeStyle = .custom(LorealColors.segmentVIP)
        case "at_risk":
            displayName = "En riesgo"
            badgeStyle = .custom(LorealColors.segmentAtRisk)
        default:
            displayName = segment
            badgeStyle = .info
        }

        return LorealBadge(text: displayName, icon: nil, style: badgeStyle)
    }
}

#Preview {
    HStack(spacing: 12) {
        LorealBadge(text: "VIP", icon: "star.fill", style: .accent)
        LorealBadge.segment("vip")
        LorealBadge.segment("new")
        LorealBadge.segment("at_risk")
        LorealBadge(text: "Confirmada", style: .success)
    }
    .padding()
}
