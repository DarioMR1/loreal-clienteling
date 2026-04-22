import { formatPhoneMX } from "./phone";

describe("formatPhoneMX", () => {
  it("formats a 10-digit number", () => {
    expect(formatPhoneMX("5512345678")).toBe("+52 55 1234 5678");
  });

  it("formats a number with country code", () => {
    expect(formatPhoneMX("525512345678")).toBe("+52 55 1234 5678");
  });

  it("strips non-digit characters", () => {
    expect(formatPhoneMX("+52 (55) 1234-5678")).toBe("+52 55 1234 5678");
  });

  it("returns the original string for invalid lengths", () => {
    expect(formatPhoneMX("12345")).toBe("12345");
  });

  it("handles Monterrey area code", () => {
    expect(formatPhoneMX("8112345678")).toBe("+52 81 1234 5678");
  });
});
