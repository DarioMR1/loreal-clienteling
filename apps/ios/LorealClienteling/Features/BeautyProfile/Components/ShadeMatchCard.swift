import SwiftUI

/// Displays recorded shades for a beauty profile.
struct ShadeMatchCard: View {
    let shades: [BeautyShade]

    var body: some View {
        LorealCard {
            VStack(alignment: .leading, spacing: LorealSpacing.md) {
                HStack {
                    Image(systemName: "paintpalette.fill")
                        .font(.title3)
                        .foregroundStyle(LorealColors.accent)
                    Text("Mis tonos")
                        .font(LorealTypography.headline)
                        .foregroundStyle(LorealColors.textPrimary)
                }

                if shades.isEmpty {
                    Text("Sin tonos registrados")
                        .font(LorealTypography.callout)
                        .foregroundStyle(LorealColors.textTertiary)
                } else {
                    // Group by category
                    let grouped = Dictionary(grouping: shades, by: \.category)
                    ForEach(Array(grouped.keys.sorted()), id: \.self) { category in
                        VStack(alignment: .leading, spacing: LorealSpacing.xs) {
                            Text(shadeDisplayCategory(category))
                                .font(LorealTypography.footnote)
                                .foregroundStyle(LorealColors.textSecondary)

                            ForEach(grouped[category] ?? []) { shade in
                                HStack(spacing: LorealSpacing.xs) {
                                    RoundedRectangle(cornerRadius: 4)
                                        .fill(LorealColors.accent.opacity(0.2))
                                        .frame(width: 24, height: 24)
                                        .overlay(
                                            Text(shade.shadeCode.prefix(2))
                                                .font(.system(size: 8, weight: .bold))
                                                .foregroundStyle(LorealColors.accent)
                                        )
                                    Text(shade.shadeCode)
                                        .font(LorealTypography.callout)
                                        .foregroundStyle(LorealColors.textPrimary)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private func shadeDisplayCategory(_ category: String) -> String {
        switch category {
        case "foundation": "Base"
        case "concealer": "Corrector"
        case "lipstick": "Labial"
        case "blush": "Rubor"
        default: category.capitalized
        }
    }
}
