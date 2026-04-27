import SwiftUI

/// Styled text field with floating-style label and 60px minimum height.
struct LorealTextField: View {
    let label: String
    @Binding var text: String
    var keyboardType: UIKeyboardType = .default
    var autocapitalization: TextInputAutocapitalization = .sentences
    var isSecure: Bool = false

    var body: some View {
        Group {
            if isSecure {
                SecureField(label, text: $text)
            } else {
                TextField(label, text: $text)
                    .keyboardType(keyboardType)
                    .textInputAutocapitalization(autocapitalization)
            }
        }
        .font(LorealTypography.body)
        .padding(.horizontal, LorealSpacing.md)
        .frame(minHeight: LorealSpacing.touchTarget)
        .background(LorealColors.surfaceSecondary)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        .foregroundStyle(LorealColors.textPrimary)
    }
}

#Preview {
    VStack(spacing: 16) {
        LorealTextField(label: "Email", text: .constant(""), keyboardType: .emailAddress)
        LorealTextField(label: "Contraseña", text: .constant(""), isSecure: true)
    }
    .padding()
    .background(LorealColors.background)
}
