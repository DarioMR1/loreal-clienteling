import { formatMXN } from "./currency";

describe("formatMXN", () => {
  it("formats a whole number", () => {
    expect(formatMXN(1234)).toBe("$1,234.00");
  });

  it("formats decimals", () => {
    expect(formatMXN(1234.5)).toBe("$1,234.50");
  });

  it("formats zero", () => {
    expect(formatMXN(0)).toBe("$0.00");
  });

  it("formats large numbers", () => {
    expect(formatMXN(1000000)).toBe("$1,000,000.00");
  });

  it("formats negative numbers", () => {
    expect(formatMXN(-500)).toBe("-$500.00");
  });
});
