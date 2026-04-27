import SwiftUI

struct LoginView: View {
    @Environment(AuthManager.self) private var auth
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        ZStack {
            LorealColors.background
                .ignoresSafeArea()

            VStack(spacing: LorealSpacing.xl) {
                Spacer()

                // Brand header
                VStack(spacing: LorealSpacing.xs) {
                    Text("L'Oréal")
                        .font(LorealTypography.brandLargeTitle)
                        .foregroundStyle(LorealColors.textPrimary)
                    Text("Clienteling")
                        .font(LorealTypography.brandHeadline)
                        .foregroundStyle(LorealColors.textSecondary)
                }

                // Form
                VStack(spacing: LorealSpacing.md) {
                    LorealTextField(
                        label: "Email",
                        text: $email,
                        keyboardType: .emailAddress,
                        autocapitalization: .never
                    )
                    .textContentType(.emailAddress)
                    .autocorrectionDisabled()

                    LorealTextField(
                        label: "Contraseña",
                        text: $password,
                        isSecure: true
                    )
                    .textContentType(.password)
                }
                .frame(maxWidth: 400)

                // Error
                if let error = auth.errorMessage {
                    Text(error)
                        .font(LorealTypography.footnote)
                        .foregroundStyle(LorealColors.error)
                        .multilineTextAlignment(.center)
                }

                // Sign in button
                Button {
                    Task {
                        await auth.signIn(email: email, password: password)
                    }
                } label: {
                    Group {
                        if auth.isLoading {
                            ProgressView()
                                .tint(LorealColors.textOnAccent)
                        } else {
                            Text("Iniciar sesión")
                                .font(LorealTypography.headline)
                        }
                    }
                    .frame(maxWidth: 400)
                    .frame(height: LorealSpacing.touchTarget)
                    .foregroundStyle(LorealColors.textOnAccent)
                    .background(
                        isFormValid ? LorealColors.accent : LorealColors.accent.opacity(0.4)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
                .disabled(!isFormValid || auth.isLoading)

                Spacer()
            }
            .padding(.horizontal, LorealSpacing.xl)
        }
    }

    private var isFormValid: Bool {
        !email.isEmpty && password.count >= 8
    }
}

#Preview {
    LoginView()
        .environment(AuthManager())
}
