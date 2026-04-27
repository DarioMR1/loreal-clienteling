import SwiftUI

/// Visual card displaying skin type, tone, subtone, and concerns.
struct SkinProfileCard: View {
    let profile: BeautyProfile

    var body: some View {
        LorealCard {
            VStack(alignment: .leading, spacing: LorealSpacing.md) {
                // Header
                HStack {
                    Image(systemName: "face.smiling")
                        .font(.title3)
                        .foregroundStyle(LorealColors.accent)
                    Text("Tipo de piel")
                        .font(LorealTypography.headline)
                        .foregroundStyle(LorealColors.textPrimary)
                }

                // Skin attributes
                HStack(spacing: LorealSpacing.lg) {
                    attributeColumn("Tipo", value: SkinTypeDisplay.name(profile.skinType))
                    attributeColumn("Tono", value: SkinToneDisplay.name(profile.skinTone))
                    attributeColumn("Subtono", value: SkinSubtoneDisplay.name(profile.skinSubtone))
                }

                // Tone visual indicator
                if let tone = profile.skinTone {
                    toneSwatches(selected: tone)
                }

                // Concerns
                if let concerns = profile.skinConcerns, !concerns.isEmpty {
                    VStack(alignment: .leading, spacing: LorealSpacing.xs) {
                        Text("Preocupaciones")
                            .font(LorealTypography.footnote)
                            .foregroundStyle(LorealColors.textSecondary)

                        FlowLayout(spacing: LorealSpacing.xs) {
                            ForEach(concerns, id: \.self) { concern in
                                LorealBadge(text: SkinConcernDisplay.name(concern), style: .warning)
                            }
                        }
                    }
                }

                // Avoided ingredients
                if let avoided = profile.avoidedIngredients, !avoided.isEmpty {
                    VStack(alignment: .leading, spacing: LorealSpacing.xs) {
                        Text("Ingredientes a evitar")
                            .font(LorealTypography.footnote)
                            .foregroundStyle(LorealColors.textSecondary)

                        FlowLayout(spacing: LorealSpacing.xs) {
                            ForEach(avoided, id: \.self) { ingredient in
                                LorealBadge(text: ingredient, icon: "exclamationmark.triangle", style: .error)
                            }
                        }
                    }
                }
            }
        }
    }

    private func attributeColumn(_ label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label)
                .font(LorealTypography.caption)
                .foregroundStyle(LorealColors.textTertiary)
            Text(value)
                .font(LorealTypography.callout)
                .fontWeight(.medium)
                .foregroundStyle(LorealColors.textPrimary)
        }
    }

    private func toneSwatches(selected: String) -> some View {
        let tones: [(String, Color)] = [
            ("fair", Color(hex: "FDEBD0")),
            ("light", Color(hex: "F5CBA7")),
            ("medium", Color(hex: "D4A574")),
            ("tan", Color(hex: "B07D5B")),
            ("deep", Color(hex: "7B5544")),
        ]

        return HStack(spacing: LorealSpacing.xs) {
            ForEach(tones, id: \.0) { tone, color in
                Circle()
                    .fill(color)
                    .frame(width: 28, height: 28)
                    .overlay(
                        Circle()
                            .stroke(tone == selected ? LorealColors.accent : .clear, lineWidth: 3)
                    )
                    .overlay(
                        tone == selected
                            ? Image(systemName: "checkmark")
                                .font(.caption2.weight(.bold))
                                .foregroundStyle(.white)
                            : nil
                    )
            }
        }
    }
}

/// Simple flow layout for wrapping badges.
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = arrange(proposal: proposal, subviews: subviews)
        return result.size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = arrange(proposal: proposal, subviews: subviews)
        for (index, position) in result.positions.enumerated() {
            subviews[index].place(at: CGPoint(x: bounds.minX + position.x, y: bounds.minY + position.y), proposal: .unspecified)
        }
    }

    private func arrange(proposal: ProposedViewSize, subviews: Subviews) -> (size: CGSize, positions: [CGPoint]) {
        let maxWidth = proposal.width ?? .infinity
        var positions: [CGPoint] = []
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth && x > 0 {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            positions.append(CGPoint(x: x, y: y))
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
        }

        return (CGSize(width: maxWidth, height: y + rowHeight), positions)
    }
}
