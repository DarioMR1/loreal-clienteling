import SwiftUI

struct LoginView: View {
    @Environment(AuthManager.self) private var auth
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        NavigationStack {
            VStack(spacing: 32) {
                Spacer()

                VStack(spacing: 8) {
                    Text("L'Oréal")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    Text("Clienteling")
                        .font(.title2)
                        .foregroundStyle(.secondary)
                }

                VStack(spacing: 16) {
                    TextField("Email", text: $email)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                        .padding()
                        .background(.fill.tertiary)
                        .clipShape(RoundedRectangle(cornerRadius: 12))

                    SecureField("Contraseña", text: $password)
                        .textContentType(.password)
                        .padding()
                        .background(.fill.tertiary)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                if let error = auth.errorMessage {
                    Text(error)
                        .font(.footnote)
                        .foregroundStyle(.red)
                        .multilineTextAlignment(.center)
                }

                Button {
                    Task {
                        await auth.signIn(email: email, password: password)
                    }
                } label: {
                    if auth.isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Text("Iniciar sesión")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .disabled(email.isEmpty || password.count < 8 || auth.isLoading)

                Spacer()
            }
            .padding(.horizontal, 32)
        }
    }
}

#Preview {
    LoginView()
        .environment(AuthManager())
}
