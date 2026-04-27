import SwiftUI

/// Left column of the 360° profile — avatar, name, segment, contact, quick actions.
struct CustomerIdentityColumn: View {
    let customer: Customer

    var body: some View {
        VStack(spacing: LorealSpacing.md) {
            // Avatar
            LorealAvatar(name: customer.fullName, size: .large)

            // Name + segment
            VStack(spacing: LorealSpacing.xs) {
                Text(customer.fullName)
                    .font(LorealTypography.brandTitle)
                    .foregroundStyle(LorealColors.textPrimary)
                    .multilineTextAlignment(.center)

                LorealBadge.segment(customer.lifecycleSegment)
            }

            Divider()

            // Contact info
            VStack(alignment: .leading, spacing: LorealSpacing.xs) {
                if let phone = customer.phone {
                    contactRow(icon: "phone.fill", text: phone)
                }
                if let email = customer.email {
                    contactRow(icon: "envelope.fill", text: email)
                }
                if let gender = customer.gender {
                    contactRow(icon: "person.fill", text: genderDisplayName(gender))
                }
            }

            Divider()

            // Quick action buttons
            VStack(spacing: LorealSpacing.xs) {
                quickActionButton(icon: "message.fill", label: "WhatsApp") {}
                quickActionButton(icon: "calendar.badge.plus", label: "Agendar cita") {}
                quickActionButton(icon: "sparkles", label: "Recomendar") {}
            }

            Spacer()
        }
        .padding(LorealSpacing.md)
        .frame(width: 220)
        .background(LorealColors.surface)
    }

    // MARK: - Components

    private func contactRow(icon: String, text: String) -> some View {
        HStack(spacing: LorealSpacing.xs) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundStyle(LorealColors.accent)
                .frame(width: 20)
            Text(text)
                .font(LorealTypography.footnote)
                .foregroundStyle(LorealColors.textSecondary)
                .lineLimit(1)
        }
    }

    private func quickActionButton(icon: String, label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: LorealSpacing.xs) {
                Image(systemName: icon)
                    .frame(width: 20)
                Text(label)
                    .font(LorealTypography.subheadline)
                Spacer()
            }
            .foregroundStyle(LorealColors.accent)
            .padding(.horizontal, LorealSpacing.sm)
            .frame(minHeight: 44)
            .background(LorealColors.accent.opacity(0.08))
            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
        .buttonStyle(.plain)
    }

    private func genderDisplayName(_ gender: String) -> String {
        switch gender {
        case "female": "Femenino"
        case "male": "Masculino"
        case "non_binary": "No binario"
        case "prefer_not_say": "Prefiere no decir"
        default: gender
        }
    }
}
