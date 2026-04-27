import SwiftUI

/// Loads an appointment by ID and shows the detail view.
/// Bridge between the router (which has an ID) and AppointmentDetailView (which needs the full object).
struct AppointmentDetailPlaceholder: View {
    let appointmentId: String
    @Environment(AuthManager.self) private var auth
    @State private var appointment: Appointment?
    @State private var isLoading = true

    var body: some View {
        Group {
            if isLoading {
                LorealLoadingView(message: "Cargando cita...")
            } else if let appointment {
                AppointmentDetailView(appointment: appointment) { newStatus in
                    guard let token = auth.token else { return }
                    let repo = AppointmentRepository(token: token)
                    if let updated = try? await repo.update(id: appointmentId, UpdateAppointmentBody(status: newStatus)) {
                        self.appointment = updated
                    }
                }
            } else {
                LorealErrorView(message: "No se encontró la cita.")
            }
        }
        .task {
            guard let token = auth.token else { return }
            let repo = AppointmentRepository(token: token)
            appointment = try? await repo.findOne(id: appointmentId)
            isLoading = false
        }
    }
}
