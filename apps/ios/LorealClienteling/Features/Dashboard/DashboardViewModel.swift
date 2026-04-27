import Foundation

/// ViewModel for the BA's "Today" dashboard.
@MainActor
@Observable
final class DashboardViewModel {
    private let analyticsRepo: AnalyticsRepository
    private let token: String?

    var dashboardState: LoadingState<DashboardData> = .idle

    init(client: Client, token: String?) {
        self.analyticsRepo = AnalyticsRepository(client: client)
        self.token = token
    }

    func loadDashboard() async {
        dashboardState = .loading
        do {
            guard let token else {
                dashboardState = .loaded(.empty)
                return
            }
            let data = try await analyticsRepo.getDashboard(token: token)
            dashboardState = .loaded(data)
        } catch let error as APIError {
            dashboardState = .error(error)
        } catch {
            dashboardState = .error(.unknown(error.localizedDescription))
        }
    }
}
