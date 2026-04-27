import SwiftUI

/// Form for creating or editing a beauty profile.
struct BeautyProfileFormView: View {
    let customerId: String
    let existing: BeautyProfile?
    var onSaved: (() -> Void)?

    @Environment(AuthManager.self) private var auth
    @Environment(\.dismiss) private var dismiss

    // Skin
    @State private var skinType = ""
    @State private var skinTone = ""
    @State private var skinSubtone = ""
    @State private var skinConcerns: Set<String> = []

    // Preferences
    @State private var routineType = ""
    @State private var fragrancePrefs: Set<String> = []
    @State private var interests: Set<String> = []

    // Ingredients
    @State private var avoidedIngredients = ""

    @State private var isSaving = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: LorealSpacing.lg) {

                    // Skin Type
                    sectionPicker("Tipo de piel", selection: $skinType, options: [
                        ("dry", "Seca"), ("oily", "Grasa"), ("combination", "Mixta"),
                        ("sensitive", "Sensible"), ("normal", "Normal"),
                    ])

                    // Skin Tone
                    sectionPicker("Tono de piel", selection: $skinTone, options: [
                        ("fair", "Clara"), ("light", "Ligera"), ("medium", "Media"),
                        ("tan", "Bronceada"), ("deep", "Profunda"),
                    ])

                    // Subtone
                    sectionPicker("Subtono", selection: $skinSubtone, options: [
                        ("cool", "Frío"), ("neutral", "Neutro"), ("warm", "Cálido"),
                    ])

                    // Concerns (multi-select chips)
                    multiSelectSection("Preocupaciones", selection: $skinConcerns, options: [
                        ("acne", "Acné"), ("aging", "Envejecimiento"), ("pigmentation", "Pigmentación"),
                        ("dryness", "Resequedad"), ("sensitivity", "Sensibilidad"),
                        ("pores", "Poros"), ("dark_circles", "Ojeras"), ("redness", "Rojez"),
                    ])

                    // Routine
                    sectionPicker("Rutina", selection: $routineType, options: [
                        ("morning", "Mañana"), ("night", "Noche"), ("both", "Mañana y noche"),
                    ])

                    // Fragrance
                    multiSelectSection("Fragancias", selection: $fragrancePrefs, options: [
                        ("floral", "Floral"), ("woody", "Amaderado"), ("citrus", "Cítrico"),
                        ("oriental", "Oriental"), ("fresh", "Fresco"), ("gourmand", "Gourmand"),
                    ])

                    // Interests
                    multiSelectSection("Intereses", selection: $interests, options: [
                        ("skincare", "Skincare"), ("makeup", "Maquillaje"), ("fragrance", "Fragancias"),
                    ])

                    // Avoided ingredients
                    LorealSectionHeader(title: "Ingredientes a evitar")
                    LorealTextField(label: "Ej: parabenos, alcohol (separar por comas)", text: $avoidedIngredients)
                        .padding(.horizontal, LorealSpacing.screenPadding)
                }
                .padding(.vertical, LorealSpacing.md)
            }
            .background(LorealColors.background)
            .navigationTitle(existing != nil ? "Editar perfil" : "Crear perfil de belleza")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Guardar") { Task { await save() } }
                        .disabled(isSaving)
                        .fontWeight(.semibold)
                }
            }
        }
        .onAppear { populateFromExisting() }
    }

    // MARK: - Helpers

    private func sectionPicker(_ title: String, selection: Binding<String>, options: [(String, String)]) -> some View {
        VStack(alignment: .leading, spacing: LorealSpacing.xs) {
            LorealSectionHeader(title: title)
            Picker(title, selection: selection) {
                Text("No especificado").tag("")
                ForEach(options, id: \.0) { value, label in
                    Text(label).tag(value)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal, LorealSpacing.screenPadding)
        }
    }

    private func multiSelectSection(_ title: String, selection: Binding<Set<String>>, options: [(String, String)]) -> some View {
        VStack(alignment: .leading, spacing: LorealSpacing.xs) {
            LorealSectionHeader(title: title)
            FlowLayout(spacing: LorealSpacing.xs) {
                ForEach(options, id: \.0) { value, label in
                    Button {
                        if selection.wrappedValue.contains(value) {
                            selection.wrappedValue.remove(value)
                        } else {
                            selection.wrappedValue.insert(value)
                        }
                    } label: {
                        Text(label)
                            .font(LorealTypography.subheadline)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(
                                selection.wrappedValue.contains(value)
                                    ? LorealColors.accent.opacity(0.15)
                                    : LorealColors.surfaceSecondary
                            )
                            .foregroundStyle(
                                selection.wrappedValue.contains(value)
                                    ? LorealColors.accent
                                    : LorealColors.textSecondary
                            )
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, LorealSpacing.screenPadding)
        }
    }

    private func populateFromExisting() {
        guard let p = existing else { return }
        skinType = p.skinType ?? ""
        skinTone = p.skinTone ?? ""
        skinSubtone = p.skinSubtone ?? ""
        skinConcerns = Set(p.skinConcerns ?? [])
        routineType = p.routineType ?? ""
        fragrancePrefs = Set(p.fragrancePreferences ?? [])
        interests = Set(p.interests ?? [])
        avoidedIngredients = (p.avoidedIngredients ?? []).joined(separator: ", ")
    }

    private func save() async {
        guard let token = auth.token else { return }
        isSaving = true

        let avoided = avoidedIngredients
            .split(separator: ",")
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }

        let body = UpsertBeautyProfileBody(
            customerId: customerId,
            skinType: skinType.isEmpty ? nil : skinType,
            skinTone: skinTone.isEmpty ? nil : skinTone,
            skinSubtone: skinSubtone.isEmpty ? nil : skinSubtone,
            skinConcerns: skinConcerns.isEmpty ? nil : Array(skinConcerns),
            avoidedIngredients: avoided.isEmpty ? nil : avoided,
            fragrancePreferences: fragrancePrefs.isEmpty ? nil : Array(fragrancePrefs),
            routineType: routineType.isEmpty ? nil : routineType,
            interests: interests.isEmpty ? nil : Array(interests)
        )

        let vm = BeautyProfileViewModel(token: token)
        let success = await vm.saveProfile(body)
        if success {
            onSaved?()
            dismiss()
        }
        isSaving = false
    }
}
