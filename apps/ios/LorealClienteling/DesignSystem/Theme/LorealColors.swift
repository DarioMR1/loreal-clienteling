import SwiftUI

/// Semantic color palette for the L'Oréal Clienteling app.
/// Neutral, premium canvas that lets product photography shine.
enum LorealColors {
    // MARK: - Surfaces

    /// Warm white background — primary app surface.
    static let background = Color(hex: "FAFAF8")
    /// Pure white — cards, modals, elevated surfaces.
    static let surface = Color.white
    /// Warm gray — sidebar, section headers, secondary surfaces.
    static let surfaceSecondary = Color(hex: "F5F5F2")
    /// Subtle divider / separator.
    static let divider = Color(hex: "E8E8E5")

    // MARK: - Text

    /// Charcoal — primary text. Never pure black for premium feel.
    static let textPrimary = Color(hex: "1A1A1A")
    /// Secondary labels.
    static let textSecondary = Color(hex: "6B6B6B")
    /// Tertiary / placeholder text.
    static let textTertiary = Color(hex: "9E9E9E")
    /// Text on accent-colored backgrounds.
    static let textOnAccent = Color.white

    // MARK: - Accent

    /// Gold — primary accent. Buttons, FAB, highlights.
    static let accent = Color(hex: "C9A96E")
    /// Rose gold — secondary accent.
    static let accentSecondary = Color(hex: "B76E79")
    /// Darker gold for pressed states.
    static let accentPressed = Color(hex: "A88B52")

    // MARK: - Semantic Status

    static let success = Color(hex: "4CAF50")
    static let warning = Color(hex: "FF9800")
    static let error = Color(hex: "E53935")
    static let info = Color(hex: "2196F3")

    // MARK: - Lifecycle Segments

    static let segmentNew = Color(hex: "81C784")
    static let segmentReturning = Color(hex: "64B5F6")
    static let segmentVIP = Color(hex: "C9A96E")
    static let segmentAtRisk = Color(hex: "EF5350")

    // MARK: - Connectivity

    static let online = Color(hex: "4CAF50")
    static let syncing = Color(hex: "FF9800")
    static let offline = Color(hex: "E53935")

    // MARK: - Helpers

    /// Returns the color for a lifecycle segment string.
    static func forSegment(_ segment: String) -> Color {
        switch segment.lowercased() {
        case "new": segmentNew
        case "returning": segmentReturning
        case "vip": segmentVIP
        case "at_risk": segmentAtRisk
        default: textTertiary
        }
    }
}
