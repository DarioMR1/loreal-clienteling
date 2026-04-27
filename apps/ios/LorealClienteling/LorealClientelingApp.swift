import SwiftUI

@main
struct LorealClientelingApp: App {
    @State private var authManager = AuthManager()

    var body: some Scene {
        WindowGroup {
            Group {
                if authManager.isAuthenticated {
                    HomeView()
                } else {
                    LoginView()
                }
            }
            .environment(authManager)
        }
    }
}
