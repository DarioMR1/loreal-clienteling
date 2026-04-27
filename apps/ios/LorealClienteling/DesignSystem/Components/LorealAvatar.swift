import SwiftUI

/// Circle avatar with initials fallback or AsyncImage.
struct LorealAvatar: View {
    let name: String
    var imageURL: URL?
    var size: AvatarSize = .medium

    enum AvatarSize {
        case small, medium, large

        var dimension: CGFloat {
            switch self {
            case .small: 32
            case .medium: 48
            case .large: 64
            }
        }

        var font: Font {
            switch self {
            case .small: .caption2.weight(.semibold)
            case .medium: .callout.weight(.semibold)
            case .large: .title3.weight(.semibold)
            }
        }
    }

    var body: some View {
        if let imageURL {
            AsyncImage(url: imageURL) { image in
                image
                    .resizable()
                    .scaledToFill()
            } placeholder: {
                initialsView
            }
            .frame(width: size.dimension, height: size.dimension)
            .clipShape(Circle())
        } else {
            initialsView
        }
    }

    private var initialsView: some View {
        ZStack {
            Circle()
                .fill(LorealColors.accent.opacity(0.15))
            Text(initials)
                .font(size.font)
                .foregroundStyle(LorealColors.accent)
        }
        .frame(width: size.dimension, height: size.dimension)
    }

    private var initials: String {
        let parts = name.split(separator: " ")
        let first = parts.first?.prefix(1) ?? ""
        let last = parts.count > 1 ? parts.last!.prefix(1) : ""
        return "\(first)\(last)".uppercased()
    }
}

#Preview {
    HStack(spacing: 16) {
        LorealAvatar(name: "María López", size: .small)
        LorealAvatar(name: "Ana García", size: .medium)
        LorealAvatar(name: "Rosa Hernández", size: .large)
    }
    .padding()
}
