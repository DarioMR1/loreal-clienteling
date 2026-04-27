import SwiftUI

/// Error state with message and retry button.
struct LorealErrorView: View {
    let message: String
    var onRetry: (@Sendable () async -> Void)?

    var body: some View {
        VStack(spacing: LorealSpacing.md) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 40))
                .foregroundStyle(LorealColors.error)

            Text(message)
                .font(LorealTypography.body)
                .foregroundStyle(LorealColors.textSecondary)
                .multilineTextAlignment(.center)

            if let onRetry {
                Button {
                    Task { await onRetry() }
                } label: {
                    Text("Reintentar")
                        .font(LorealTypography.headline)
                        .foregroundStyle(LorealColors.accent)
                }
                .padding(.top, LorealSpacing.xs)
            }
        }
        .padding(LorealSpacing.xl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    LorealErrorView(message: "Error al cargar datos.") {}
}
