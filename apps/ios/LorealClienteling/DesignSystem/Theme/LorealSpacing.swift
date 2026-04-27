import Foundation

/// Spacing scale for consistent layout rhythm.
enum LorealSpacing {
    /// 4pt — tight spacing between related elements.
    static let xxs: CGFloat = 4
    /// 8pt — compact spacing.
    static let xs: CGFloat = 8
    /// 12pt — default spacing between small elements.
    static let sm: CGFloat = 12
    /// 16pt — standard spacing.
    static let md: CGFloat = 16
    /// 24pt — spacing between sections.
    static let lg: CGFloat = 24
    /// 32pt — large section spacing.
    static let xl: CGFloat = 32
    /// 48pt — major section dividers.
    static let xxl: CGFloat = 48

    /// Standard card internal padding.
    static let cardPadding: CGFloat = 16
    /// Standard screen edge padding.
    static let screenPadding: CGFloat = 20
    /// Minimum touch target size (60pt for iPad retail use).
    static let touchTarget: CGFloat = 60
}
