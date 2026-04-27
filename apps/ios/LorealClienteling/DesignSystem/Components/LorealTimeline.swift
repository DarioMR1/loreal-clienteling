import SwiftUI

/// Vertical timeline with circle markers and connecting lines.
struct LorealTimeline<Content: View>: View {
    let items: [TimelineItem]
    let content: (TimelineItem) -> Content

    init(items: [TimelineItem], @ViewBuilder content: @escaping (TimelineItem) -> Content) {
        self.items = items
        self.content = content
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                HStack(alignment: .top, spacing: LorealSpacing.sm) {
                    // Timeline marker
                    VStack(spacing: 0) {
                        Circle()
                            .fill(item.color)
                            .frame(width: 12, height: 12)
                            .padding(.top, 4)

                        if index < items.count - 1 {
                            Rectangle()
                                .fill(LorealColors.divider)
                                .frame(width: 2)
                                .frame(minHeight: 40)
                        }
                    }
                    .frame(width: 12)

                    // Content
                    VStack(alignment: .leading, spacing: LorealSpacing.xxs) {
                        content(item)
                    }
                    .padding(.bottom, LorealSpacing.md)
                }
            }
        }
    }
}

/// A single item in a timeline.
struct TimelineItem: Identifiable {
    let id: String
    let date: Date
    let title: String
    let subtitle: String?
    let icon: String
    let color: Color
    let type: String

    init(
        id: String = UUID().uuidString,
        date: Date,
        title: String,
        subtitle: String? = nil,
        icon: String = "circle.fill",
        color: Color = LorealColors.accent,
        type: String = ""
    ) {
        self.id = id
        self.date = date
        self.title = title
        self.subtitle = subtitle
        self.icon = icon
        self.color = color
        self.type = type
    }
}

#Preview {
    LorealTimeline(items: [
        TimelineItem(date: .now, title: "Compra registrada", subtitle: "$2,450 MXN", icon: "bag.fill", color: LorealColors.success),
        TimelineItem(date: .now.addingTimeInterval(-86400), title: "Recomendación enviada", subtitle: "Sérum Advanced", icon: "sparkles", color: LorealColors.accent),
        TimelineItem(date: .now.addingTimeInterval(-172800), title: "Cita completada", subtitle: "Facial express", icon: "calendar", color: LorealColors.info),
    ]) { item in
        VStack(alignment: .leading, spacing: 2) {
            Text(item.title)
                .font(LorealTypography.callout)
                .foregroundStyle(LorealColors.textPrimary)
            if let subtitle = item.subtitle {
                Text(subtitle)
                    .font(LorealTypography.footnote)
                    .foregroundStyle(LorealColors.textSecondary)
            }
            Text(item.date.relativeFormatted)
                .font(LorealTypography.caption)
                .foregroundStyle(LorealColors.textTertiary)
        }
    }
    .padding()
}
