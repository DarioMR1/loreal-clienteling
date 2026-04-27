import Foundation

/// ViewModel for the appointment list.
@MainActor
@Observable
final class AppointmentListViewModel {
    private let repository: AppointmentRepository

    var state: LoadingState<[Appointment]> = .idle
    var showCalendar = false

    init(token: String) {
        self.repository = AppointmentRepository(token: token)
    }

    func loadAppointments() async {
        state = .loading
        do {
            let appointments = try await repository.findAll()
            state = .loaded(appointments)
        } catch let error as APIError {
            state = .error(error)
        } catch {
            state = .error(.unknown(error.localizedDescription))
        }
    }

    func updateStatus(id: String, status: String) async {
        do {
            _ = try await repository.update(id: id, UpdateAppointmentBody(status: status))
            await loadAppointments()
        } catch {
            // Silently fail — could show toast in future
        }
    }
}
