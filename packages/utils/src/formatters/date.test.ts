import { formatDateMX, formatDateShort, formatDateTime } from "./date";

describe("formatDateMX", () => {
  it("formats a date in Spanish", () => {
    const result = formatDateMX(new Date(2026, 2, 15));
    expect(result).toBe("15 de marzo de 2026");
  });
});

describe("formatDateShort", () => {
  it("formats as dd/MM/yyyy", () => {
    expect(formatDateShort(new Date(2026, 0, 5))).toBe("05/01/2026");
  });
});

describe("formatDateTime", () => {
  it("formats with time", () => {
    const result = formatDateTime(new Date(2026, 5, 10, 14, 30));
    expect(result).toBe("10/06/2026 14:30");
  });
});
