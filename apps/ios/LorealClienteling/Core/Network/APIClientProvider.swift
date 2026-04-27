import Foundation

/// Provides an authenticated OpenAPI Client instance.
/// Injected via SwiftUI `.environment()` so any view/viewmodel can access the API.
@MainActor
@Observable
final class APIClientProvider {
    private let authManager: AuthManager

    init(authManager: AuthManager) {
        self.authManager = authManager
    }

    /// Returns a Client configured with the current auth token.
    /// A new Client is created each call so token changes (refresh) are picked up.
    var client: Client {
        APIClientFactory.makeClient(token: authManager.token)
    }
}
