import Foundation

/// Shared server configuration — single source of truth for API base URL.
enum ServerConfig {
    static var baseURL: URL {
        if let override = ProcessInfo.processInfo.environment["API_BASE_URL"],
           let url = URL(string: override) {
            return url
        }
        #if DEBUG
        return URL(string: "http://localhost:3001")!
        #else
        return URL(string: "https://api.example.com")!
        #endif
    }
}
