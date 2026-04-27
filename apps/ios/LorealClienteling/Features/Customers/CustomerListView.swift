import SwiftUI

/// Content column view showing the list of customers with search and segment filter.
struct CustomerListView: View {
    @Environment(AuthManager.self) private var auth
    @Environment(AppRouter.self) private var router
    @State private var viewModel: CustomerListViewModel?
    @State private var showingNewCustomer = false

    var body: some View {
        VStack(spacing: 0) {
            // Search bar
            if let vm = viewModel {
                LorealSearchBar(text: Binding(
                    get: { vm.searchQuery },
                    set: { vm.searchQuery = $0 }
                ), placeholder: "Buscar clienta por nombre, email o teléfono...")
                .padding(.horizontal, LorealSpacing.screenPadding)
                .padding(.vertical, LorealSpacing.xs)

                // Segment filter
                LorealSegmentPicker(
                    options: [
                        SegmentOption("Todas", value: "all"),
                        SegmentOption("Nuevas", value: "new", dotColor: LorealColors.segmentNew),
                        SegmentOption("Recurrentes", value: "returning", dotColor: LorealColors.segmentReturning),
                        SegmentOption("VIP", value: "vip", dotColor: LorealColors.segmentVIP),
                        SegmentOption("En riesgo", value: "at_risk", dotColor: LorealColors.segmentAtRisk),
                    ],
                    selection: Binding(
                        get: { vm.selectedSegment },
                        set: { segment in
                            Task { await vm.filterBySegment(segment) }
                        }
                    )
                )
                .padding(.bottom, LorealSpacing.xs)
            }

            Divider()

            // Customer list
            customerList
        }
        .background(LorealColors.background)
        .navigationTitle("Mis Clientas")
        .fab(icon: "plus", label: "Nueva") {
            showingNewCustomer = true
        }
        .sheet(isPresented: $showingNewCustomer) {
            Text("Nuevo cliente — Fase 2.3")
        }
        .task {
            if viewModel == nil, let token = auth.token {
                viewModel = CustomerListViewModel(token: token)
            }
            await viewModel?.loadCustomers()
        }
        .task(id: viewModel?.searchQuery) {
            try? await Task.sleep(for: .milliseconds(350))
            await viewModel?.search()
        }
    }

    @ViewBuilder
    private var customerList: some View {
        if let vm = viewModel {
            switch vm.state {
            case .idle, .loading:
                LorealLoadingView(message: "Cargando clientas...")
            case .loaded(let customers):
                if customers.isEmpty {
                    LorealEmptyState(
                        icon: "person.2.slash",
                        title: "Sin clientas",
                        subtitle: "No se encontraron clientas con estos filtros.",
                        actionLabel: "Registrar clienta"
                    ) {
                        showingNewCustomer = true
                    }
                } else {
                    ScrollView {
                        LazyVStack(spacing: LorealSpacing.xxs) {
                            ForEach(customers) { customer in
                                @Bindable var r = router
                                CustomerRow(
                                    customer: customer,
                                    isSelected: r.selectedItemID == customer.id
                                )
                                .onTapGesture {
                                    r.selectedItemID = customer.id
                                }
                            }
                        }
                        .padding(.vertical, LorealSpacing.xs)
                    }
                }
            case .error(let error):
                LorealErrorView(message: error.localizedDescription) {
                    await vm.loadCustomers()
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        CustomerListView()
    }
    .environment(AuthManager())
    .environment(AppRouter())
}
