import Foundation

/// Beauty profile model matching the NestJS response (beautyProfile + shades).
struct BeautyProfile: Codable, Sendable {
    let id: String
    let customerId: String
    let skinType: String?
    let skinTone: String?
    let skinSubtone: String?
    let skinConcerns: [String]?
    let preferredIngredients: [String]?
    let avoidedIngredients: [String]?
    let fragrancePreferences: [String]?
    let makeupPreferences: AnyCodable?
    let routineType: String?
    let interests: [String]?
    let createdAt: String?
    let updatedAt: String?
    let shades: [BeautyShade]?
}

struct BeautyShade: Codable, Identifiable, Sendable {
    let id: String
    let beautyProfileId: String
    let category: String
    let brandId: String
    let productId: String
    let shadeCode: String
    let capturedAt: String?
    let capturedByUserId: String

    var categoryDisplayName: String {
        switch category {
        case "foundation": "Base"
        case "concealer": "Corrector"
        case "lipstick": "Labial"
        case "blush": "Rubor"
        default: category
        }
    }
}

/// DTO for upserting a beauty profile.
struct UpsertBeautyProfileBody: Codable, Sendable {
    let customerId: String
    var skinType: String?
    var skinTone: String?
    var skinSubtone: String?
    var skinConcerns: [String]?
    var preferredIngredients: [String]?
    var avoidedIngredients: [String]?
    var fragrancePreferences: [String]?
    var routineType: String?
    var interests: [String]?
}

/// Passthrough for arbitrary JSON (makeupPreferences).
struct AnyCodable: Codable, Sendable {
    init() {}
    init(from decoder: Decoder) throws {
        // Accept any JSON value without crashing
        _ = try? decoder.singleValueContainer()
    }
    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encodeNil()
    }
}

// MARK: - Display name helpers

enum SkinTypeDisplay {
    static func name(_ value: String?) -> String {
        switch value {
        case "dry": "Seca"
        case "oily": "Grasa"
        case "combination": "Mixta"
        case "sensitive": "Sensible"
        case "normal": "Normal"
        default: "No especificado"
        }
    }
}

enum SkinToneDisplay {
    static func name(_ value: String?) -> String {
        switch value {
        case "fair": "Clara"
        case "light": "Ligera"
        case "medium": "Media"
        case "tan": "Bronceada"
        case "deep": "Profunda"
        default: "No especificado"
        }
    }
}

enum SkinSubtoneDisplay {
    static func name(_ value: String?) -> String {
        switch value {
        case "cool": "Frío"
        case "neutral": "Neutro"
        case "warm": "Cálido"
        default: "No especificado"
        }
    }
}

enum SkinConcernDisplay {
    static func name(_ value: String) -> String {
        switch value {
        case "acne": "Acné"
        case "aging": "Envejecimiento"
        case "pigmentation": "Pigmentación"
        case "dryness": "Resequedad"
        case "sensitivity": "Sensibilidad"
        case "pores": "Poros"
        case "dark_circles": "Ojeras"
        case "redness": "Rojez"
        default: value
        }
    }
}

enum FragranceDisplay {
    static func name(_ value: String) -> String {
        switch value {
        case "floral": "Floral"
        case "woody": "Amaderado"
        case "citrus": "Cítrico"
        case "oriental": "Oriental"
        case "fresh": "Fresco"
        case "gourmand": "Gourmand"
        default: value
        }
    }
}

enum RoutineDisplay {
    static func name(_ value: String?) -> String {
        switch value {
        case "morning": "Mañana"
        case "night": "Noche"
        case "both": "Mañana y noche"
        default: "No especificado"
        }
    }
}
