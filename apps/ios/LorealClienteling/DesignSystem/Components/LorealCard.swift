import SwiftUI

/// Premium card container with subtle shadow and rounded corners.
struct LorealCard<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .padding(LorealSpacing.cardPadding)
            .background(LorealColors.surface)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
    }
}

#Preview {
    LorealCard {
        VStack(alignment: .leading, spacing: 8) {
            Text("Título de Card")
                .font(LorealTypography.headline)
            Text("Contenido descriptivo del card.")
                .font(LorealTypography.body)
                .foregroundStyle(LorealColors.textSecondary)
        }
    }
    .padding()
    .background(LorealColors.background)
}
