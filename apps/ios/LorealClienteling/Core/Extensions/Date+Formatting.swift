import Foundation

extension Date {
    private static let mxLocale = Locale(identifier: "es_MX")

    /// "15 de abril de 2026"
    var longFormatted: String {
        formatted(.dateTime.day().month(.wide).year().locale(Self.mxLocale))
    }

    /// "15/04/2026"
    var shortFormatted: String {
        formatted(.dateTime.day(.twoDigits).month(.twoDigits).year().locale(Self.mxLocale))
    }

    /// "15/04/2026 14:30"
    var dateTimeFormatted: String {
        formatted(.dateTime.day(.twoDigits).month(.twoDigits).year().hour().minute().locale(Self.mxLocale))
    }

    /// "hace 2 horas", "hace 3 días"
    var relativeFormatted: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.locale = Self.mxLocale
        formatter.unitsStyle = .full
        return formatter.localizedString(for: self, relativeTo: .now)
    }

    /// "14:30"
    var timeFormatted: String {
        formatted(.dateTime.hour(.twoDigits(amPM: .omitted)).minute(.twoDigits).locale(Self.mxLocale))
    }

    /// Returns true if this date is today.
    var isToday: Bool {
        Calendar.current.isDateInToday(self)
    }

    /// Returns true if this date is within the next N days.
    func isWithinNext(days: Int) -> Bool {
        let now = Date.now
        let future = Calendar.current.date(byAdding: .day, value: days, to: now) ?? now
        return self >= now && self <= future
    }
}
