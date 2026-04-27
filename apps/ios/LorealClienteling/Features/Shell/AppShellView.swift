import SwiftUI

/// Root authenticated view — three-column NavigationSplitView.
/// Sidebar (nav) | Content (list/dashboard) | Detail (profile/form)
struct AppShellView: View {
    @State private var router = AppRouter()
    @State private var columnVisibility = NavigationSplitViewVisibility.all
    @Environment(APIClientProvider.self) private var apiProvider

    var body: some View {
        NavigationSplitView(columnVisibility: $columnVisibility) {
            SidebarView(selection: $router.selectedSection)
        } content: {
            contentColumn
        } detail: {
            detailColumn
        }
        .navigationSplitViewStyle(.balanced)
        .environment(router)
        .tint(LorealColors.accent)
    }

    // MARK: - Content Column

    @ViewBuilder
    private var contentColumn: some View {
        switch router.selectedSection {
        case .dashboard:
            DashboardView()
        case .customers:
            CustomerListView()
        case .appointments:
            AppointmentListView()
        case .catalog:
            // Phase 8 — placeholder
            LorealEmptyState(
                icon: "bag",
                title: "Catálogo",
                subtitle: "Próximamente"
            )
        case .followups:
            // Phase 7 — placeholder
            LorealEmptyState(
                icon: "message",
                title: "Seguimientos",
                subtitle: "Próximamente"
            )
        case .profile:
            // Phase 9 — placeholder
            LorealEmptyState(
                icon: "person.crop.circle",
                title: "Mi Perfil",
                subtitle: "Próximamente"
            )
        }
    }

    // MARK: - Detail Column

    @ViewBuilder
    private var detailColumn: some View {
        switch router.selectedSection {
        case .dashboard:
            LorealEmptyState(
                icon: "hand.tap",
                title: "Selecciona un elemento",
                subtitle: "Toca una cita o seguimiento para ver su detalle."
            )
        case .customers:
            if let customerId = router.selectedItemID {
                CustomerDetailView(customerId: customerId)
            } else {
                LorealEmptyState(
                    icon: "person.crop.rectangle",
                    title: "Selecciona una clienta",
                    subtitle: "Toca una clienta de la lista para ver su perfil 360°."
                )
            }
        case .appointments:
            if let appointmentId = router.selectedItemID {
                AppointmentDetailPlaceholder(appointmentId: appointmentId)
            } else {
                LorealEmptyState(
                    icon: "calendar.badge.clock",
                    title: "Selecciona una cita",
                    subtitle: "Toca una cita para ver su detalle."
                )
            }
        case .catalog:
            LorealEmptyState(
                icon: "sparkles",
                title: "Selecciona un producto",
                subtitle: "Toca un producto para ver su información."
            )
        case .followups:
            LorealEmptyState(
                icon: "paperplane",
                title: "Selecciona un seguimiento",
                subtitle: "Toca un seguimiento para enviar un mensaje."
            )
        case .profile:
            Color.clear
        }
    }
}

#Preview {
    AppShellView()
        .environment(AuthManager())
        .environment(APIClientProvider(authManager: AuthManager()))
        .environment(BrandTheme())
}
