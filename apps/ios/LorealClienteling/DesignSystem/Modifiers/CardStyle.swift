import SwiftUI

/// Applies the standard L'Oréal card appearance.
struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(LorealSpacing.cardPadding)
            .background(LorealColors.surface)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardStyle())
    }
}
