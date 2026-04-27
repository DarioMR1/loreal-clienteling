import Foundation

/// Sections available in the sidebar navigation.
enum SidebarSection: String, CaseIterable, Identifiable, Sendable {
    case dashboard = "Hoy"
    case customers = "Mis Clientas"
    case appointments = "Citas"
    case catalog = "Catálogo"
    case followups = "Seguimientos"
    case profile = "Mi Perfil"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .dashboard: "star.fill"
        case .customers: "person.2.fill"
        case .appointments: "calendar"
        case .catalog: "bag.fill"
        case .followups: "message.fill"
        case .profile: "person.crop.circle"
        }
    }
}
