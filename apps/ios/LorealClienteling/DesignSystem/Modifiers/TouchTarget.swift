import SwiftUI

/// Ensures minimum 60x60pt hit area for iPad retail use.
struct TouchTarget: ViewModifier {
    var minSize: CGFloat = LorealSpacing.touchTarget

    func body(content: Content) -> some View {
        content
            .frame(minWidth: minSize, minHeight: minSize)
            .contentShape(Rectangle())
    }
}

extension View {
    func touchTarget(_ minSize: CGFloat = LorealSpacing.touchTarget) -> some View {
        modifier(TouchTarget(minSize: minSize))
    }
}
