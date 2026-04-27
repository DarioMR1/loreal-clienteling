import SwiftUI

/// Dynamic brand theming loaded from the backend BrandConfig.
/// Injected via `.environment(brandTheme)` at the app root.
@MainActor
@Observable
final class BrandTheme {
    /// Primary accent color — defaults to L'Oréal gold.
    var accentColor: Color = LorealColors.accent
    /// Secondary accent color.
    var secondaryColor: Color = LorealColors.accentSecondary
    /// Brand display name.
    var brandName: String = "L'Oréal"
    /// Brand logo URL.
    var logoURL: URL?
    /// Font family override (not applied if nil).
    var fontFamily: String?

    /// Configures the theme from brand config hex values.
    func configure(
        primaryHex: String?,
        secondaryHex: String?,
        accentHex: String?,
        brandName: String?,
        logoURL: String?,
        fontFamily: String?
    ) {
        if let hex = primaryHex ?? accentHex {
            self.accentColor = Color(hex: hex)
        }
        if let hex = secondaryHex {
            self.secondaryColor = Color(hex: hex)
        }
        if let name = brandName {
            self.brandName = name
        }
        if let urlString = logoURL, let url = URL(string: urlString) {
            self.logoURL = url
        }
        self.fontFamily = fontFamily
    }

    /// Resets to default L'Oréal theme.
    func reset() {
        accentColor = LorealColors.accent
        secondaryColor = LorealColors.accentSecondary
        brandName = "L'Oréal"
        logoURL = nil
        fontFamily = nil
    }
}
