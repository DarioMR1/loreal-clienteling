import { isValidPhoneMX } from "./phone-mx";

describe("isValidPhoneMX", () => {
  it("accepts 10-digit numbers", () => {
    expect(isValidPhoneMX("5512345678")).toBe(true);
    expect(isValidPhoneMX("8112345678")).toBe(true);
  });

  it("accepts 12-digit with country code 52", () => {
    expect(isValidPhoneMX("525512345678")).toBe(true);
  });

  it("strips non-digits before validating", () => {
    expect(isValidPhoneMX("+52 55 1234 5678")).toBe(true);
    expect(isValidPhoneMX("(55) 1234-5678")).toBe(true);
  });

  it("rejects invalid lengths", () => {
    expect(isValidPhoneMX("12345")).toBe(false);
    expect(isValidPhoneMX("123456789012345")).toBe(false);
  });

  it("rejects 12-digit without country code 52", () => {
    expect(isValidPhoneMX("115512345678")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidPhoneMX("")).toBe(false);
  });
});
