import Foundation
import OpenAPIRuntime
import OpenAPIURLSession

/// Configured OpenAPI client pointing at the NestJS backend.
/// The generated `Client` type comes from Swift OpenAPI Generator at build time.
enum APIClientFactory {
    private static var serverURL: URL { ServerConfig.baseURL }

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
