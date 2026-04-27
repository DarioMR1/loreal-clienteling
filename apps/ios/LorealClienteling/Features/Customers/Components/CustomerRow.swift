import SwiftUI

/// A single customer row in the list.
struct CustomerRow: View {
    let customer: Customer
    let isSelected: Bool

    var body: some View {
        HStack(spacing: LorealSpacing.sm) {
            LorealAvatar(name: customer.fullName, size: .medium)

            VStack(alignment: .leading, spacing: LorealSpacing.xxs) {
                Text(customer.fullName)
                    .font(LorealTypography.headline)
                    .foregroundStyle(LorealColors.textPrimary)

                if let contact = customer.email ?? customer.phone {
                    Text(contact)
                        .font(LorealTypography.footnote)
                        .foregroundStyle(LorealColors.textSecondary)
                        .lineLimit(1)
                }
            }

            Spacer()

            LorealBadge.segment(customer.lifecycleSegment)
        }
        .padding(.vertical, LorealSpacing.xs)
        .padding(.horizontal, LorealSpacing.sm)
        .background(
            isSelected
                ? LorealColors.accent.opacity(0.08)
                : Color.clear
        )
        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        .contentShape(Rectangle())
    }
}

#Preview {
    VStack(spacing: 4) {
        CustomerRow(
            customer: Customer(
                id: "1", firstName: "María", lastName: "López",
                email: "maria@email.com", phone: nil, gender: "female",
                birthDate: nil, registeredAtStoreId: "s1",
                registeredByUserId: "u1", lastBaUserId: nil,
                customerSince: nil, lastContactAt: nil,
                lastTransactionAt: nil, lifecycleSegment: "vip",
                inactive: false, createdAt: nil, updatedAt: nil
            ),
            isSelected: false
        )
        CustomerRow(
            customer: Customer(
                id: "2", firstName: "Ana", lastName: "García",
                email: nil, phone: "+525512345678", gender: "female",
                birthDate: nil, registeredAtStoreId: "s1",
                registeredByUserId: "u1", lastBaUserId: nil,
                customerSince: nil, lastContactAt: nil,
                lastTransactionAt: nil, lifecycleSegment: "at_risk",
                inactive: false, createdAt: nil, updatedAt: nil
            ),
            isSelected: true
        )
    }
    .padding()
    .background(LorealColors.background)
}
