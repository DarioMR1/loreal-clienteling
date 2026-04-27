import SwiftUI

/// Card showing fragrance preferences and beauty interests.
struct FragrancePrefsCard: View {
    let fragrancePreferences: [String]?
    let interests: [String]?
    let routineType: String?

    var body: some View {
        LorealCard {
            VStack(alignment: .leading, spacing: LorealSpacing.md) {
                HStack {
                    Image(systemName: "wind")
                        .font(.title3)
                        .foregroundStyle(LorealColors.accent)
                    Text("Preferencias")
                        .font(LorealTypography.headline)
                        .foregroundStyle(LorealColors.textPrimary)
                }

                // Routine
                HStack {
                    Text("Rutina")
                        .font(LorealTypography.footnote)
                        .foregroundStyle(LorealColors.textSecondary)
                    Spacer()
                    Text(RoutineDisplay.name(routineType))
                        .font(LorealTypography.callout)
                        .foregroundStyle(LorealColors.textPrimary)
                }

                // Fragrances
                if let prefs = fragrancePreferences, !prefs.isEmpty {
                    VStack(alignment: .leading, spacing: LorealSpacing.xs) {
                        Text("Fragancias favoritas")
                            .font(LorealTypography.footnote)
                            .foregroundStyle(LorealColors.textSecondary)

                        FlowLayout(spacing: LorealSpacing.xs) {
                            ForEach(prefs, id: \.self) { pref in
                                LorealBadge(text: FragranceDisplay.name(pref), style: .accent)
                            }
                        }
                    }
                }

                // Interests
                if let interests, !interests.isEmpty {
                    VStack(alignment: .leading, spacing: LorealSpacing.xs) {
                        Text("Intereses")
                            .font(LorealTypography.footnote)
                            .foregroundStyle(LorealColors.textSecondary)

                        FlowLayout(spacing: LorealSpacing.xs) {
                            ForEach(interests, id: \.self) { interest in
                                LorealBadge(text: interestDisplayName(interest), style: .info)
                            }
                        }
                    }
                }
            }
        }
    }

    private func interestDisplayName(_ interest: String) -> String {
        switch interest {
        case "skincare": "Skincare"
        case "makeup": "Maquillaje"
        case "fragrance": "Fragancias"
        default: interest.capitalized
        }
    }
}
