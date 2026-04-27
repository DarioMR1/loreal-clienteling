import Foundation

/// Typed API errors with user-facing Spanish messages.
enum APIError: Error, LocalizedError, Sendable {
    case unauthorized
    case forbidden
    case notFound
    case validationFailed(String)
    case serverError(statusCode: Int)
    case networkUnavailable
    case decodingFailed
    case unknown(String)

    var errorDescription: String? {
        switch self {
        case .unauthorized:
            "Sesión expirada. Inicia sesión de nuevo."
        case .forbidden:
            "No tienes permisos para esta acción."
        case .notFound:
            "No se encontró el recurso."
        case .validationFailed(let message):
            message
        case .serverError(let code):
            "Error del servidor (\(code)). Intenta de nuevo."
        case .networkUnavailable:
            "Sin conexión a internet."
        case .decodingFailed:
            "Error al procesar la respuesta."
        case .unknown(let message):
            message
        }
    }

    /// Maps an HTTP status code to a typed error.
    static func from(statusCode: Int, message: String? = nil) -> APIError {
        switch statusCode {
        case 401: .unauthorized
        case 403: .forbidden
        case 404: .notFound
        case 422: .validationFailed(message ?? "Datos inválidos.")
        case 400: .validationFailed(message ?? "Solicitud inválida.")
        case 500...599: .serverError(statusCode: statusCode)
        default: .unknown(message ?? "Error desconocido (\(statusCode)).")
        }
    }
}
