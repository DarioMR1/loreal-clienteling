import SwiftUI

/// Horizontal scrolling filter chips.
struct LorealSegmentPicker: View {
    let options: [SegmentOption]
    @Binding var selection: String?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: LorealSpacing.xs) {
                ForEach(options) { option in
                    chipButton(option)
                }
            }
            .padding(.horizontal, LorealSpacing.screenPadding)
        }
    }

    private func chipButton(_ option: SegmentOption) -> some View {
        let isSelected = selection == option.value

        return Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                selection = isSelected ? nil : option.value
            }
        } label: {
            HStack(spacing: 6) {
                if let color = option.dotColor {
                    Circle()
                        .fill(color)
                        .frame(width: 8, height: 8)
                }
                Text(option.label)
                    .font(LorealTypography.subheadline)
                    .fontWeight(isSelected ? .semibold : .regular)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(isSelected ? LorealColors.accent.opacity(0.12) : LorealColors.surfaceSecondary)
            .foregroundStyle(isSelected ? LorealColors.accent : LorealColors.textSecondary)
            .clipShape(Capsule())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}

struct SegmentOption: Identifiable {
    let id: String
    let label: String
    let value: String
    var dotColor: Color?

    init(_ label: String, value: String, dotColor: Color? = nil) {
        self.id = value
        self.label = label
        self.value = value
        self.dotColor = dotColor
    }
}

#Preview {
    LorealSegmentPicker(
        options: [
            SegmentOption("Todas", value: "all"),
            SegmentOption("Nuevas", value: "new", dotColor: LorealColors.segmentNew),
            SegmentOption("Recurrentes", value: "returning", dotColor: LorealColors.segmentReturning),
            SegmentOption("VIP", value: "vip", dotColor: LorealColors.segmentVIP),
            SegmentOption("En riesgo", value: "at_risk", dotColor: LorealColors.segmentAtRisk),
        ],
        selection: .constant("vip")
    )
}
