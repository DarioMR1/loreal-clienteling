import SwiftUI

/// Centered loading indicator with optional message.
struct LorealLoadingView: View {
    var message: String = "Cargando..."

    var body: some View {
        VStack(spacing: LorealSpacing.md) {
            ProgressView()
                .controlSize(.large)
                .tint(LorealColors.accent)

            Text(message)
                .font(LorealTypography.callout)
                .foregroundStyle(LorealColors.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    LorealLoadingView()
        .background(LorealColors.background)
}
