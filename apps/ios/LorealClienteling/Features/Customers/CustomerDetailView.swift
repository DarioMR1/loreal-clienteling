import SwiftUI

/// Customer 360° profile — the flagship view of the app.
/// Layout: IdentityColumn (left) | Scrollable content (center)
struct CustomerDetailView: View {
    let customerId: String
    @Environment(AuthManager.self) private var auth
    @State private var viewModel: CustomerDetailViewModel?
    @State private var selectedTab = 0

    var body: some View {
        Group {
            if let vm = viewModel {
                switch vm.customerState {
                case .idle, .loading:
                    LorealLoadingView(message: "Cargando perfil...")
                case .loaded(let customer):
                    customerProfile(customer, vm: vm)
                case .error(let error):
                    LorealErrorView(message: error.localizedDescription) {
                        await vm.loadCustomer(id: customerId)
                    }
                }
            } else {
                LorealLoadingView()
            }
        }
        .task {
            if viewModel == nil, let token = auth.token {
                viewModel = CustomerDetailViewModel(token: token)
            }
            await viewModel?.loadCustomer(id: customerId)
        }
    }

    // MARK: - Profile Layout

    private func customerProfile(_ customer: Customer, vm: CustomerDetailViewModel) -> some View {
        HStack(alignment: .top, spacing: 0) {
            // Left: Identity column
            CustomerIdentityColumn(customer: customer)

            Divider()

            // Center: Scrollable content
            ScrollView {
                VStack(alignment: .leading, spacing: LorealSpacing.lg) {
                    // Summary header
                    summaryCards(customer)

                    // Tab picker
                    Picker("Sección", selection: $selectedTab) {
                        Text("Resumen").tag(0)
                        Text("Actividad").tag(1)
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal, LorealSpacing.screenPadding)

                    // Tab content
                    switch selectedTab {
                    case 0:
                        summaryTab(customer)
                    case 1:
                        CustomerActivityTimeline(items: vm.activityTimeline)
                    default:
                        EmptyView()
                    }

                    Spacer(minLength: LorealSpacing.xxl)
                }
                .padding(.vertical, LorealSpacing.md)
            }
            .background(LorealColors.background)
        }
        .navigationTitle(customer.fullName)
    }

    // MARK: - Summary Cards

    private func summaryCards(_ customer: Customer) -> some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: LorealSpacing.sm) {
                if let lastTransaction = customer.lastTransactionDate {
                    LorealKPICard(
                        title: "Última compra",
                        value: lastTransaction.relativeFormatted,
                        icon: "bag"
                    )
                }

                if let lastContact = customer.lastContactDate {
                    LorealKPICard(
                        title: "Último contacto",
                        value: lastContact.relativeFormatted,
                        icon: "person.wave.2"
                    )
                }

                LorealKPICard(
                    title: "Segmento",
                    value: customer.segmentDisplayName,
                    icon: "chart.bar"
                )
            }
            .padding(.horizontal, LorealSpacing.screenPadding)
        }
    }

    // MARK: - Summary Tab

    private func summaryTab(_ customer: Customer) -> some View {
        VStack(alignment: .leading, spacing: LorealSpacing.lg) {
            // Beauty profile
            BeautyProfileView(customerId: customer.id)

            // Contact preferences
            LorealSectionHeader(title: "Información")

            LorealCard {
                VStack(alignment: .leading, spacing: LorealSpacing.xs) {
                    infoRow("Género", value: genderName(customer.gender))
                    if let birth = customer.birthDate {
                        infoRow("Fecha de nacimiento", value: birth)
                    }
                    if let since = customer.customerSince {
                        infoRow("Clienta desde", value: since.prefix(10).description)
                    }
                }
            }
            .padding(.horizontal, LorealSpacing.screenPadding)
        }
    }

    private func infoRow(_ label: String, value: String?) -> some View {
        HStack {
            Text(label)
                .font(LorealTypography.footnote)
                .foregroundStyle(LorealColors.textSecondary)
            Spacer()
            Text(value ?? "—")
                .font(LorealTypography.footnote)
                .foregroundStyle(LorealColors.textPrimary)
        }
    }

    private func genderName(_ gender: String?) -> String? {
        switch gender {
        case "female": "Femenino"
        case "male": "Masculino"
        case "non_binary": "No binario"
        case "prefer_not_say": "Prefiere no decir"
        default: gender
        }
    }
}
