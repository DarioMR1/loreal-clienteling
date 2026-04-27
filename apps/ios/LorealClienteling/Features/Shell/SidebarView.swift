import SwiftUI

/// Sidebar navigation — left column of the NavigationSplitView.
struct SidebarView: View {
    @Binding var selection: SidebarSection
    @Environment(AuthManager.self) private var auth
    @Environment(BrandTheme.self) private var theme

    /// Main sections (everything except profile).
    private var mainSections: [SidebarSection] {
        SidebarSection.allCases.filter { $0 != .profile }
    }

    var body: some View {
        List {
            Section {
                ForEach(mainSections) { section in
                    Button {
                        selection = section
                    } label: {
                        sidebarLabel(section)
                    }
                    .listRowBackground(
                        section == selection
                            ? theme.accentColor.opacity(0.12)
                            : Color.clear
                    )
                }
            }

            Section {
                Button {
                    selection = .profile
                } label: {
                    sidebarLabel(.profile)
                }
                .listRowBackground(
                    selection == .profile
                        ? theme.accentColor.opacity(0.12)
                        : Color.clear
                )
            }
        }
        .listStyle(.sidebar)
        .navigationTitle(theme.brandName)
        .safeAreaInset(edge: .bottom) {
            bottomBar
        }
    }

    // MARK: - Components

    private func sidebarLabel(_ section: SidebarSection) -> some View {
        Label {
            Text(section.rawValue)
                .font(section == .dashboard ? LorealTypography.headline : LorealTypography.body)
        } icon: {
            Image(systemName: section.icon)
                .foregroundStyle(section == selection ? theme.accentColor : LorealColors.textSecondary)
        }
    }

    private var bottomBar: some View {
        VStack(spacing: LorealSpacing.xs) {
            Divider()

            if let user = auth.currentUser {
                HStack(spacing: LorealSpacing.xs) {
                    LorealAvatar(name: user.fullName, size: .small)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(user.fullName)
                            .font(LorealTypography.footnote)
                            .fontWeight(.medium)
                            .foregroundStyle(LorealColors.textPrimary)
                        Text(user.role.uppercased())
                            .font(LorealTypography.caption)
                            .foregroundStyle(LorealColors.textTertiary)
                    }

                    Spacer()

                    Button {
                        auth.signOut()
                    } label: {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .foregroundStyle(LorealColors.textTertiary)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Cerrar sesión")
                }
                .padding(.horizontal, LorealSpacing.md)
                .padding(.bottom, LorealSpacing.xs)
            }
        }
    }
}

#Preview {
    NavigationSplitView {
        SidebarView(selection: .constant(.dashboard))
    } detail: {
        Text("Detail")
    }
    .environment(AuthManager())
    .environment(BrandTheme())
}
