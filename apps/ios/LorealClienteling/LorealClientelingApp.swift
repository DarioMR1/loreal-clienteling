import SwiftUI

@main
struct LorealClientelingApp: App {
    @State private var authManager = AuthManager()
    @State private var brandTheme = BrandTheme()

    var body: some Scene {
        WindowGroup {
            Group {
                if authManager.isAuthenticated {
                    AppShellView()
                } else {
                    LoginView()
                }
            }
            .environment(authManager)
            .environment(brandTheme)
            .environment(APIClientProvider(authManager: authManager))
        }
    }
}
