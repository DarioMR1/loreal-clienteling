import Foundation
import OpenAPIRuntime
import OpenAPIURLSession

/// Configured OpenAPI client pointing at the NestJS backend.
/// The generated `Client` type comes from Swift OpenAPI Generator at build time.
enum APIClientFactory {
    /// Base URL for the API server.
    /// In debug builds this points to localhost; override via environment variable.
    private static var serverURL: URL {
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

    /// Creates a new OpenAPI `Client` with Bearer token authentication.
    static func makeClient(token: String? = nil) -> Client {
        var middlewares: [any ClientMiddleware] = []
        if let token {
            middlewares.append(BearerAuthMiddleware(token: token))
        }
        return Client(
            serverURL: serverURL,
            transport: URLSessionTransport(),
            middlewares: middlewares
        )
    }
}
