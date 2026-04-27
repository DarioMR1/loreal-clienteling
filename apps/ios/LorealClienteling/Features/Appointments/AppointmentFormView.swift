import SwiftUI

/// Form for creating a new appointment.
struct AppointmentFormView: View {
    var onSaved: ((Appointment) -> Void)?

    @Environment(AuthManager.self) private var auth
    @Environment(\.dismiss) private var dismiss

    @State private var customerId = ""
    @State private var eventType = "cabin_service"
    @State private var scheduledDate = Date.now.addingTimeInterval(3600)
    @State private var durationMinutes = 30
    @State private var comments = ""
    @State private var isVirtual = false
    @State private var isSaving = false
    @State private var errorMessage: String?

    private let eventTypes = [
        ("cabin_service", "Servicio de cabina"),
        ("facial", "Facial"),
        ("anniversary_event", "Evento aniversario"),
        ("vip_cabin", "Cabina VIP"),
        ("product_followup", "Seguimiento de producto"),
        ("custom", "Personalizado"),
    ]

    private let durations = [15, 30, 45, 60, 90, 120]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: LorealSpacing.lg) {

                    // Customer ID (in future: customer picker)
                    LorealSectionHeader(title: "Clienta")
                    LorealTextField(label: "ID de la clienta", text: $customerId)
                        .padding(.horizontal, LorealSpacing.screenPadding)

                    // Event type
                    LorealSectionHeader(title: "Tipo de evento")
                    Picker("Tipo", selection: $eventType) {
                        ForEach(eventTypes, id: \.0) { value, label in
                            Text(label).tag(value)
                        }
                    }
                    .pickerStyle(.menu)
                    .padding(.horizontal, LorealSpacing.screenPadding)

                    // Date & time
                    LorealSectionHeader(title: "Fecha y hora")
                    DatePicker("Fecha", selection: $scheduledDate, in: Date.now...)
                        .datePickerStyle(.graphical)
                        .tint(LorealColors.accent)
                        .padding(.horizontal, LorealSpacing.screenPadding)

                    // Duration
                    LorealSectionHeader(title: "Duración")
                    Picker("Duración", selection: $durationMinutes) {
                        ForEach(durations, id: \.self) { mins in
                            Text("\(mins) min").tag(mins)
                        }
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal, LorealSpacing.screenPadding)

                    // Virtual toggle
                    Toggle("Cita virtual", isOn: $isVirtual)
                        .tint(LorealColors.accent)
                        .padding(.horizontal, LorealSpacing.screenPadding)

                    // Comments
                    LorealSectionHeader(title: "Comentarios")
                    LorealTextField(label: "Notas opcionales", text: $comments)
                        .padding(.horizontal, LorealSpacing.screenPadding)

                    // Error
                    if let errorMessage {
                        Text(errorMessage)
                            .font(LorealTypography.footnote)
                            .foregroundStyle(LorealColors.error)
                            .padding(.horizontal, LorealSpacing.screenPadding)
                    }
                }
                .padding(.vertical, LorealSpacing.md)
            }
            .background(LorealColors.background)
            .navigationTitle("Nueva cita")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Agendar") { Task { await save() } }
                        .disabled(customerId.isEmpty || isSaving)
                        .fontWeight(.semibold)
                }
            }
        }
    }

    private func save() async {
        guard let token = auth.token else { return }
        isSaving = true
        errorMessage = nil

        let repo = AppointmentRepository(token: token)
        let isoFormatter = ISO8601DateFormatter()

        do {
            let appointment = try await repo.create(CreateAppointmentBody(
                customerId: customerId,
                eventType: eventType,
                scheduledAt: isoFormatter.string(from: scheduledDate),
                durationMinutes: durationMinutes,
                comments: comments.isEmpty ? nil : comments,
                isVirtual: isVirtual
            ))
            onSaved?(appointment)
            dismiss()
        } catch let error as APIError {
            errorMessage = error.localizedDescription
        } catch {
            errorMessage = error.localizedDescription
        }
        isSaving = false
    }
}
