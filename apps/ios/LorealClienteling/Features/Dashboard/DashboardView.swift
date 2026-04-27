import SwiftUI

/// The BA's "Today" dashboard — home screen.
/// Shows KPIs, today's appointments, pending follow-ups, and alerts.
struct DashboardView: View {
    @Environment(APIClientProvider.self) private var apiProvider
    @Environment(AuthManager.self) private var auth
    @State private var viewModel: DashboardViewModel?

    // Placeholder data until API is wired
    @State private var appointments: [DashboardAppointment] = []
    @State private var followups: [DashboardFollowup] = []

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: LorealSpacing.lg) {
                // Header
                headerSection

                // KPI row
                if let vm = viewModel {
                    switch vm.dashboardState {
                    case .idle, .loading:
                        HStack {
                            Spacer()
                            ProgressView()
                                .controlSize(.regular)
                                .tint(LorealColors.accent)
                            Spacer()
                        }
                        .padding(.vertical, LorealSpacing.lg)
                    case .loaded(let data):
                        KPISummaryRow(data: data)
                    case .error:
                        LorealCard {
                            HStack {
                                Image(systemName: "exclamationmark.triangle")
                                    .foregroundStyle(LorealColors.warning)
                                Text("No se pudieron cargar las métricas")
                                    .font(LorealTypography.callout)
                                    .foregroundStyle(LorealColors.textSecondary)
                                Spacer()
                                Button("Reintentar") {
                                    Task { await viewModel?.loadDashboard() }
                                }
                                .font(LorealTypography.callout)
                                .foregroundStyle(LorealColors.accent)
                            }
                        }
                        .padding(.horizontal, LorealSpacing.screenPadding)
                    }
                }

                // Today's appointments
                TodayAppointmentsList(appointments: appointments)

                // Pending follow-ups
                PendingFollowupsList(followups: followups)

                Spacer(minLength: LorealSpacing.xxl)
            }
            .padding(.vertical, LorealSpacing.md)
        }
        .background(LorealColors.background)
        .navigationTitle("Hoy")
        .task {
            if viewModel == nil {
                viewModel = DashboardViewModel(client: apiProvider.client, token: auth.token)
            }
            await viewModel?.loadDashboard()
        }
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: LorealSpacing.xxs) {
            Text(Date.now.longFormatted)
                .font(LorealTypography.footnote)
                .foregroundStyle(LorealColors.textTertiary)
            Text("Buenos días")
                .font(LorealTypography.brandTitle)
                .foregroundStyle(LorealColors.textPrimary)
        }
        .padding(.horizontal, LorealSpacing.screenPadding)
    }
}

#Preview {
    NavigationStack {
        DashboardView()
    }
    .environment(APIClientProvider(authManager: AuthManager()))
    .environment(BrandTheme())
}
