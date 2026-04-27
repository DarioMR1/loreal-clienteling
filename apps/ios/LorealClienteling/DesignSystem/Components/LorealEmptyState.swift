import SwiftUI

/// Empty state with SF Symbol, title, subtitle, and optional CTA.
struct LorealEmptyState: View {
    let icon: String
    let title: String
    var subtitle: String?
    var actionLabel: String?
    var action: (() -> Void)?

    var body: some View {
        VStack(spacing: LorealSpacing.md) {
            Image(systemName: icon)
                .font(.system(size: 48))
                .foregroundStyle(LorealColors.textTertiary)

            Text(title)
                .font(LorealTypography.title)
                .foregroundStyle(LorealColors.textPrimary)
                .multilineTextAlignment(.center)

            if let subtitle {
                Text(subtitle)
                    .font(LorealTypography.body)
                    .foregroundStyle(LorealColors.textSecondary)
                    .multilineTextAlignment(.center)
            }

            if let actionLabel, let action {
                Button(actionLabel, action: action)
                    .font(LorealTypography.headline)
                    .foregroundStyle(LorealColors.accent)
                    .padding(.top, LorealSpacing.xs)
            }
        }
        .padding(LorealSpacing.xl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    LorealEmptyState(
        icon: "person.2.slash",
        title: "Sin clientas",
        subtitle: "Registra tu primera clienta para comenzar.",
        actionLabel: "Registrar clienta"
    ) {}
}
