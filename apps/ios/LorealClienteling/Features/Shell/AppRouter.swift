import Foundation

/// Centralized navigation state for the three-column layout.
@MainActor
@Observable
final class AppRouter {
    var selectedSection: SidebarSection = .dashboard
    var selectedItemID: String?

    func navigate(to section: SidebarSection, itemID: String? = nil) {
        selectedSection = section
        selectedItemID = itemID
    }

    func clearDetail() {
        selectedItemID = nil
    }
}
