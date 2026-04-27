import Foundation

/// ViewModel for the Customer 360° profile view.
@MainActor
@Observable
final class CustomerDetailViewModel {
    private let repository: CustomerRepository
    private let token: String

    var customerState: LoadingState<Customer> = .idle
    var activityTimeline: [TimelineItem] = []

    init(token: String) {
        self.repository = CustomerRepository(token: token)
        self.token = token
    }

    func loadCustomer(id: String) async {
        customerState = .loading
        do {
            let customer = try await repository.findOne(id: id)
            customerState = .loaded(customer)
            await loadTimeline(customerId: id)
        } catch let error as APIError {
            customerState = .error(error)
        } catch {
            customerState = .error(.unknown(error.localizedDescription))
        }
    }

    // MARK: - Timeline

    private func loadTimeline(customerId: String) async {
        // Load purchases, recommendations, appointments, communications
        // Each is a separate API call — we compose the timeline
        var items: [TimelineItem] = []

        // Purchases
        if let purchases: [PurchaseEntry] = try? await fetchJSON("customers/\(customerId)/purchases") {
            for p in purchases {
                items.append(TimelineItem(
                    id: p.id,
                    date: ISO8601DateFormatter().date(from: p.purchasedAt ?? "") ?? .now,
                    title: "Compra registrada",
                    subtitle: "$\(p.totalAmount ?? "0") MXN",
                    icon: "bag.fill",
                    color: LorealColors.success,
                    type: "purchase"
                ))
            }
        }

        // Recommendations
        if let recs: [RecommendationEntry] = try? await fetchJSON("customers/\(customerId)/recommendations") {
            for r in recs {
                items.append(TimelineItem(
                    id: r.id,
                    date: ISO8601DateFormatter().date(from: r.recommendedAt ?? "") ?? .now,
                    title: "Recomendación",
                    subtitle: r.notes,
                    icon: "sparkles",
                    color: LorealColors.accent,
                    type: "recommendation"
                ))
            }
        }

        // Appointments
        if let appts: [AppointmentEntry] = try? await fetchJSON("appointments?customerId=\(customerId)") {
            for a in appts {
                items.append(TimelineItem(
                    id: a.id,
                    date: ISO8601DateFormatter().date(from: a.scheduledAt ?? "") ?? .now,
                    title: "Cita: \(a.eventType ?? "")",
                    subtitle: a.status,
                    icon: "calendar",
                    color: LorealColors.info,
                    type: "appointment"
                ))
            }
        }

        // Sort by date descending
        activityTimeline = items.sorted { $0.date > $1.date }
    }

    private func fetchJSON<T: Decodable>(_ path: String) async throws -> T {
        var request = URLRequest(url: ServerConfig.baseURL.appendingPathComponent(path))
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(T.self, from: data)
    }
}

// MARK: - Lightweight models for timeline entries

private struct PurchaseEntry: Codable, Sendable {
    let id: String
    let purchasedAt: String?
    let totalAmount: String?
}

private struct RecommendationEntry: Codable, Sendable {
    let id: String
    let recommendedAt: String?
    let notes: String?
}

private struct AppointmentEntry: Codable, Sendable {
    let id: String
    let scheduledAt: String?
    let eventType: String?
    let status: String?
}
