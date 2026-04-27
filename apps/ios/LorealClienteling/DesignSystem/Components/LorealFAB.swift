import SwiftUI

/// Floating Action Button — 60x60, positioned bottom-trailing.
/// Wrap the parent content in `.overlay` to position this.
struct LorealFAB: View {
    let icon: String
    var label: String?
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: LorealSpacing.xs) {
                Image(systemName: icon)
                    .font(.title3.weight(.semibold))
                if let label {
                    Text(label)
                        .font(LorealTypography.headline)
                }
            }
            .foregroundStyle(LorealColors.textOnAccent)
            .frame(minWidth: LorealSpacing.touchTarget, minHeight: LorealSpacing.touchTarget)
            .padding(.horizontal, label != nil ? LorealSpacing.md : 0)
            .background(LorealColors.accent)
            .clipShape(Capsule())
            .shadow(color: LorealColors.accent.opacity(0.3), radius: 12, x: 0, y: 4)
        }
        .accessibilityLabel(label ?? "Crear nuevo")
    }
}

/// View modifier to overlay a FAB in the bottom-trailing position.
extension View {
    func fab(icon: String, label: String? = nil, action: @escaping () -> Void) -> some View {
        overlay(alignment: .bottomTrailing) {
            LorealFAB(icon: icon, label: label, action: action)
                .padding(LorealSpacing.screenPadding)
        }
    }
}

#Preview {
    Color(LorealColors.background)
        .ignoresSafeArea()
        .fab(icon: "plus", label: "Nueva clienta") {}
}
