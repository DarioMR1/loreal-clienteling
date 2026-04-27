import SwiftUI

/// Content column view for appointments — list or calendar toggle.
struct AppointmentListView: View {
    @Environment(AuthManager.self) private var auth
    @Environment(AppRouter.self) private var router
    @State private var viewModel: AppointmentListViewModel?
    @State private var showingNewAppointment = false

    var body: some View {
        VStack(spacing: 0) {
            // Toggle list/calendar
            if let vm = viewModel {
                Picker("Vista", selection: Binding(
                    get: { vm.showCalendar },
                    set: { vm.showCalendar = $0 }
                )) {
                    Label("Lista", systemImage: "list.bullet").tag(false)
                    Label("Calendario", systemImage: "calendar").tag(true)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, LorealSpacing.screenPadding)
                .padding(.vertical, LorealSpacing.xs)
            }

            Divider()

            // Content
            appointmentContent
        }
        .background(LorealColors.background)
        .navigationTitle("Citas")
        .fab(icon: "plus", label: "Nueva cita") {
            showingNewAppointment = true
        }
        .sheet(isPresented: $showingNewAppointment) {
            AppointmentFormView { _ in
                Task { await viewModel?.loadAppointments() }
            }
        }
        .task {
            if viewModel == nil, let token = auth.token {
                viewModel = AppointmentListViewModel(token: token)
            }
            await viewModel?.loadAppointments()
        }
    }

    @ViewBuilder
    private var appointmentContent: some View {
        if let vm = viewModel {
            if vm.showCalendar {
                // Calendar view placeholder — a simple grouped-by-date list
                calendarView(vm)
            } else {
                listView(vm)
            }
        }
    }

    private func listView(_ vm: AppointmentListViewModel) -> some View {
        Group {
            switch vm.state {
            case .idle, .loading:
                LorealLoadingView(message: "Cargando citas...")
            case .loaded(let appointments):
                if appointments.isEmpty {
                    LorealEmptyState(
                        icon: "calendar.badge.exclamationmark",
                        title: "Sin citas",
                        subtitle: "No hay citas programadas.",
                        actionLabel: "Agendar cita"
                    ) { showingNewAppointment = true }
                } else {
                    ScrollView {
                        LazyVStack(spacing: LorealSpacing.xxs) {
                            @Bindable var r = router
                            ForEach(appointments) { appt in
                                AppointmentRow(appointment: appt, isSelected: r.selectedItemID == appt.id)
                                    .onTapGesture { r.selectedItemID = appt.id }
                            }
                        }
                        .padding(.vertical, LorealSpacing.xs)
                    }
                }
            case .error(let error):
                LorealErrorView(message: error.localizedDescription) {
                    await vm.loadAppointments()
                }
            }
        }
    }

    private func calendarView(_ vm: AppointmentListViewModel) -> some View {
        Group {
            switch vm.state {
            case .idle, .loading:
                LorealLoadingView()
            case .loaded(let appointments):
                let grouped = Dictionary(grouping: appointments) { appt in
                    appt.scheduledDate?.shortFormatted ?? "Sin fecha"
                }
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: LorealSpacing.md) {
                        ForEach(Array(grouped.keys.sorted()), id: \.self) { dateKey in
                            LorealSectionHeader(title: dateKey)
                            ForEach(grouped[dateKey] ?? []) { appt in
                                @Bindable var r = router
                                AppointmentRow(appointment: appt, isSelected: r.selectedItemID == appt.id)
                                    .onTapGesture { r.selectedItemID = appt.id }
                            }
                        }
                    }
                    .padding(.vertical, LorealSpacing.xs)
                }
            case .error(let error):
                LorealErrorView(message: error.localizedDescription) {
                    await vm.loadAppointments()
                }
            }
        }
    }
}
