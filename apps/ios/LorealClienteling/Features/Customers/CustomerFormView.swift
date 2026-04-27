import SwiftUI

/// Form for creating or editing a customer.
struct CustomerFormView: View {
    @Environment(AuthManager.self) private var auth
    @Environment(\.dismiss) private var dismiss

    var existingCustomer: Customer?
    var onSaved: ((Customer) -> Void)?

    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var gender = ""
    @State private var birthDate = ""
    @State private var isSaving = false
    @State private var errorMessage: String?

    private var isEditing: Bool { existingCustomer != nil }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: LorealSpacing.lg) {
                    // Name
                    LorealSectionHeader(title: "Datos personales")

                    VStack(spacing: LorealSpacing.md) {
                        LorealTextField(label: "Nombre *", text: $firstName)
                            .textContentType(.givenName)
                        LorealTextField(label: "Apellido *", text: $lastName)
                            .textContentType(.familyName)
                    }
                    .padding(.horizontal, LorealSpacing.screenPadding)

                    // Contact
                    LorealSectionHeader(title: "Contacto")

                    VStack(spacing: LorealSpacing.md) {
                        LorealTextField(label: "Email", text: $email, keyboardType: .emailAddress, autocapitalization: .never)
                            .textContentType(.emailAddress)
                        LorealTextField(label: "Teléfono (10 dígitos)", text: $phone, keyboardType: .phonePad)
                            .textContentType(.telephoneNumber)
                    }
                    .padding(.horizontal, LorealSpacing.screenPadding)

                    // Gender
                    LorealSectionHeader(title: "Género")

                    Picker("Género", selection: $gender) {
                        Text("No especificado").tag("")
                        Text("Femenino").tag("female")
                        Text("Masculino").tag("male")
                        Text("No binario").tag("non_binary")
                        Text("Prefiere no decir").tag("prefer_not_say")
                    }
                    .pickerStyle(.segmented)
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
            .navigationTitle(isEditing ? "Editar clienta" : "Nueva clienta")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(isEditing ? "Guardar" : "Registrar") {
                        Task { await save() }
                    }
                    .disabled(!isFormValid || isSaving)
                    .fontWeight(.semibold)
                }
            }
        }
        .onAppear {
            if let c = existingCustomer {
                firstName = c.firstName
                lastName = c.lastName
                email = c.email ?? ""
                phone = c.phone ?? ""
                gender = c.gender ?? ""
                birthDate = c.birthDate ?? ""
            }
        }
    }

    private var isFormValid: Bool {
        !firstName.trimmingCharacters(in: .whitespaces).isEmpty &&
        !lastName.trimmingCharacters(in: .whitespaces).isEmpty
    }

    private func save() async {
        guard let token = auth.token else { return }
        isSaving = true
        errorMessage = nil

        let repo = CustomerRepository(token: token)

        do {
            let customer: Customer
            if let existing = existingCustomer {
                customer = try await repo.update(id: existing.id, UpdateCustomerBody(
                    firstName: firstName,
                    lastName: lastName,
                    email: email.isEmpty ? nil : email,
                    phone: phone.isEmpty ? nil : phone,
                    gender: gender.isEmpty ? nil : gender,
                    birthDate: birthDate.isEmpty ? nil : birthDate
                ))
            } else {
                customer = try await repo.create(CreateCustomerBody(
                    firstName: firstName,
                    lastName: lastName,
                    email: email.isEmpty ? nil : email,
                    phone: phone.isEmpty ? nil : phone,
                    gender: gender.isEmpty ? nil : gender,
                    birthDate: birthDate.isEmpty ? nil : birthDate
                ))
            }
            onSaved?(customer)
            dismiss()
        } catch let error as APIError {
            errorMessage = error.localizedDescription
        } catch {
            errorMessage = error.localizedDescription
        }

        isSaving = false
    }
}
