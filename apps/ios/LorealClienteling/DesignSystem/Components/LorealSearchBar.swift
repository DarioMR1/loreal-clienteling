import SwiftUI

/// Search bar with debounce support via `.task(id:)`.
struct LorealSearchBar: View {
    @Binding var text: String
    var placeholder: String = "Buscar..."
    var onCommit: (() -> Void)?

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: LorealSpacing.xs) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(LorealColors.textTertiary)

            TextField(placeholder, text: $text)
                .font(LorealTypography.body)
                .foregroundStyle(LorealColors.textPrimary)
                .focused($isFocused)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .onSubmit { onCommit?() }

            if !text.isEmpty {
                Button {
                    text = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(LorealColors.textTertiary)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, LorealSpacing.sm)
        .frame(minHeight: 44)
        .background(LorealColors.surfaceSecondary)
        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
    }
}

#Preview {
    LorealSearchBar(text: .constant("María"))
        .padding()
        .background(LorealColors.background)
}
