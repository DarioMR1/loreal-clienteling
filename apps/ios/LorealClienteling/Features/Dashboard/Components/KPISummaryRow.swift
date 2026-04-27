import SwiftUI

/// Horizontal row of KPI cards for the dashboard.
struct KPISummaryRow: View {
    let data: DashboardData

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: LorealSpacing.sm) {
                LorealKPICard(
                    title: "Clientas",
                    value: "\(data.totalCustomers)",
                    icon: "person.2"
                )

                LorealKPICard(
                    title: "Nuevas este mes",
                    value: "\(data.newCustomersThisMonth)",
                    icon: "person.badge.plus"
                )

                LorealKPICard(
                    title: "Compras",
                    value: "\(data.totalPurchases)",
                    icon: "bag"
                )

                LorealKPICard(
                    title: "Ingresos",
                    value: formatCurrency(data.totalRevenue),
                    icon: "dollarsign.circle"
                )

                LorealKPICard(
                    title: "Citas",
                    value: "\(data.totalAppointments)",
                    icon: "calendar"
                )
            }
            .padding(.horizontal, LorealSpacing.screenPadding)
        }
    }

    private func formatCurrency(_ amount: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "MXN"
        formatter.locale = Locale(identifier: "es_MX")
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: amount)) ?? "$\(Int(amount))"
    }
}

#Preview {
    KPISummaryRow(data: DashboardData(
        totalCustomers: 127,
        totalPurchases: 45,
        totalRevenue: 156_780,
        totalAppointments: 12,
        newCustomersThisMonth: 8
    ))
    .background(LorealColors.background)
}
