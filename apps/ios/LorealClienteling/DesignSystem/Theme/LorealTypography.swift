import SwiftUI

/// Type scale for the L'Oréal Clienteling app.
/// Serif (Georgia) for brand moments, SF Pro (system) for functional UI.
enum LorealTypography {
    // MARK: - Brand Serif (headings, hero moments)

    static let brandLargeTitle = Font.custom("Georgia", size: 28, relativeTo: .largeTitle)
    static let brandTitle = Font.custom("Georgia", size: 22, relativeTo: .title)
    static let brandHeadline = Font.custom("Georgia", size: 17, relativeTo: .headline)

    // MARK: - Functional (SF Pro — system default)

    static let title = Font.title2.weight(.semibold)
    static let headline = Font.headline
    static let body = Font.body
    static let callout = Font.callout
    static let subheadline = Font.subheadline
    static let footnote = Font.footnote
    static let caption = Font.caption

    // MARK: - KPI Numbers (rounded design for dashboard metrics)

    static let kpiLarge = Font.system(size: 36, weight: .bold, design: .rounded)
    static let kpiMedium = Font.system(size: 24, weight: .semibold, design: .rounded)
    static let kpiSmall = Font.system(size: 18, weight: .medium, design: .rounded)
}
