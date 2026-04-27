import SwiftUI

struct HomeView: View {
    @Environment(AuthManager.self) private var auth

    var body: some View {
        NavigationStack {
            List {
                if let user = auth.currentUser {
                    Section("Perfil") {
                        LabeledContent("Nombre", value: user.fullName)
                        LabeledContent("Email", value: user.email)
                        LabeledContent("Rol", value: user.role)
                    }
                }

                Section("Módulos") {
                    Label("Clientes", systemImage: "person.2")
                    Label("Citas", systemImage: "calendar")
                    Label("Productos", systemImage: "bag")
                    Label("Comunicaciones", systemImage: "message")
                }
            }
            .navigationTitle("Clienteling")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Cerrar sesión") {
                        auth.signOut()
                    }
                }
            }
        }
    }
}

#Preview {
    HomeView()
        .environment(AuthManager())
}
