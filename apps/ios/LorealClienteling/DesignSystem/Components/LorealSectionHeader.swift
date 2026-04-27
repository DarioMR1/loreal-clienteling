import SwiftUI

/// Section header with title and optional trailing action.
struct LorealSectionHeader: View {
    let title: String
    var actionLabel: String?
    var action: (() -> Void)?

    var body: some View {
        HStack {
            Text(title)
                .font(LorealTypography.headline)
                .foregroundStyle(LorealColors.textPrimary)

            Spacer()

            if let actionLabel, let action {
                Button(actionLabel, action: action)
                    .font(LorealTypography.subheadline)
                    .foregroundStyle(LorealColors.accent)
            }
        }
        .padding(.horizontal, LorealSpacing.screenPadding)
        .padding(.vertical, LorealSpacing.xs)
    }
}

#Preview {
    VStack(spacing: 0) {
        LorealSectionHeader(title: "Citas de hoy")
        LorealSectionHeader(title: "Seguimientos", actionLabel: "Ver todos") {}
    }
}
