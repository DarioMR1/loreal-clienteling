import SwiftUI

/// Displays the beauty profile for a customer inside the 360° detail view.
struct BeautyProfileView: View {
    let customerId: String
    @Environment(AuthManager.self) private var auth
    @State private var viewModel: BeautyProfileViewModel?
    @State private var showingEditForm = false

    var body: some View {
        Group {
            if let vm = viewModel {
                switch vm.state {
                case .idle, .loading:
                    ProgressView()
                        .tint(LorealColors.accent)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(LorealSpacing.lg)
                case .loaded(let profile):
                    if let profile {
                        profileContent(profile)
                    } else {
                        emptyProfile
                    }
                case .error:
                    LorealCard {
                        HStack {
                            Image(systemName: "exclamationmark.triangle")
                                .foregroundStyle(LorealColors.warning)
                            Text("No se pudo cargar el perfil de belleza")
                                .font(LorealTypography.callout)
                                .foregroundStyle(LorealColors.textSecondary)
                        }
                    }
                }
            }
        }
        .task {
            if viewModel == nil, let token = auth.token {
                viewModel = BeautyProfileViewModel(token: token)
            }
            await viewModel?.loadProfile(customerId: customerId)
        }
        .sheet(isPresented: $showingEditForm) {
            BeautyProfileFormView(
                customerId: customerId,
                existing: viewModel?.state.value ?? nil
            ) {
                Task { await viewModel?.loadProfile(customerId: customerId) }
            }
        }
    }

    // MARK: - Content

    private func profileContent(_ profile: BeautyProfile) -> some View {
        VStack(alignment: .leading, spacing: LorealSpacing.md) {
            LorealSectionHeader(title: "Perfil de belleza", actionLabel: "Editar") {
                showingEditForm = true
            }

            SkinProfileCard(profile: profile)
                .padding(.horizontal, LorealSpacing.screenPadding)

            ShadeMatchCard(shades: profile.shades ?? [])
                .padding(.horizontal, LorealSpacing.screenPadding)

            FragrancePrefsCard(
                fragrancePreferences: profile.fragrancePreferences,
                interests: profile.interests,
                routineType: profile.routineType
            )
            .padding(.horizontal, LorealSpacing.screenPadding)
        }
    }

    private var emptyProfile: some View {
        LorealCard {
            VStack(spacing: LorealSpacing.sm) {
                Image(systemName: "sparkle.magnifyingglass")
                    .font(.title2)
                    .foregroundStyle(LorealColors.accent)
                Text("Sin perfil de belleza")
                    .font(LorealTypography.callout)
                    .foregroundStyle(LorealColors.textSecondary)
                Button("Crear perfil") {
                    showingEditForm = true
                }
                .font(LorealTypography.headline)
                .foregroundStyle(LorealColors.accent)
            }
            .frame(maxWidth: .infinity)
        }
        .padding(.horizontal, LorealSpacing.screenPadding)
    }
}
