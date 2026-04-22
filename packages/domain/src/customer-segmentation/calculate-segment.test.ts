import { calculateSegment, SegmentationInput } from "./calculate-segment";

const BASE_DATE = new Date("2026-04-21");

function makeInput(overrides: Partial<SegmentationInput>): SegmentationInput {
  return {
    registeredAt: new Date("2025-01-01"),
    transactionCount12Months: 0,
    totalSpending12Months: 0,
    lastTransactionAt: null,
    lastCommunicationAt: null,
    vipSpendingThreshold: 15000,
    now: BASE_DATE,
    ...overrides,
  };
}

describe("calculateSegment", () => {
  describe("new segment", () => {
    it("classifies customer registered less than 30 days ago with no transactions", () => {
      const result = calculateSegment(
        makeInput({
          registeredAt: new Date("2026-04-10"),
          transactionCount12Months: 0,
        }),
      );
      expect(result.segment).toBe("new");
      expect(result.inactive).toBe(false);
    });

    it("classifies customer registered less than 30 days ago with 1 transaction", () => {
      const result = calculateSegment(
        makeInput({
          registeredAt: new Date("2026-04-05"),
          transactionCount12Months: 1,
          lastTransactionAt: new Date("2026-04-10"),
        }),
      );
      expect(result.segment).toBe("new");
      expect(result.inactive).toBe(false);
    });
  });

  describe("vip segment", () => {
    it("classifies customer with 6+ transactions in 12 months", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 7,
          lastTransactionAt: new Date("2026-04-01"),
        }),
      );
      expect(result.segment).toBe("vip");
      expect(result.inactive).toBe(false);
    });

    it("classifies customer exceeding spending threshold", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 3,
          totalSpending12Months: 20000,
          lastTransactionAt: new Date("2026-03-15"),
        }),
      );
      expect(result.segment).toBe("vip");
      expect(result.inactive).toBe(false);
      expect(result.reason).toContain("supera umbral VIP");
    });

    it("does not classify as VIP when spending equals threshold exactly", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 3,
          totalSpending12Months: 15000,
          lastTransactionAt: new Date("2026-03-15"),
        }),
      );
      expect(result.segment).not.toBe("vip");
    });
  });

  describe("returning segment", () => {
    it("classifies customer with 2-5 transactions in 12 months", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 3,
          lastTransactionAt: new Date("2026-03-01"),
        }),
      );
      expect(result.segment).toBe("returning");
      expect(result.inactive).toBe(false);
    });

    it("classifies customer at lower bound (2 transactions)", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 2,
          lastTransactionAt: new Date("2026-03-01"),
        }),
      );
      expect(result.segment).toBe("returning");
    });

    it("classifies customer at upper bound (5 transactions)", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 5,
          lastTransactionAt: new Date("2026-03-01"),
        }),
      );
      expect(result.segment).toBe("returning");
    });
  });

  describe("at_risk segment", () => {
    it("classifies customer with last transaction 120-365 days ago", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 1,
          lastTransactionAt: new Date("2025-11-01"),
        }),
      );
      expect(result.segment).toBe("at_risk");
      expect(result.inactive).toBe(false);
    });

    it("classifies customer with last transaction >365 days ago as inactive", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 0,
          lastTransactionAt: new Date("2025-01-01"),
        }),
      );
      expect(result.segment).toBe("at_risk");
      expect(result.inactive).toBe(true);
    });

    it("keeps at_risk but not inactive if recent followup exists for >365d customer", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 0,
          lastTransactionAt: new Date("2025-01-01"),
          lastCommunicationAt: new Date("2026-03-01"),
        }),
      );
      expect(result.segment).toBe("at_risk");
      expect(result.inactive).toBe(false);
    });

    it("classifies customer with no transactions and registered >30 days ago", () => {
      const result = calculateSegment(
        makeInput({
          registeredAt: new Date("2025-06-01"),
          transactionCount12Months: 0,
          lastTransactionAt: null,
        }),
      );
      expect(result.segment).toBe("at_risk");
    });
  });

  describe("edge cases", () => {
    it("VIP takes priority over returning (6 transactions)", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 6,
          lastTransactionAt: new Date("2026-04-01"),
        }),
      );
      expect(result.segment).toBe("vip");
    });

    it("at_risk takes priority over returning when last tx is old", () => {
      const result = calculateSegment(
        makeInput({
          transactionCount12Months: 3,
          lastTransactionAt: new Date("2025-10-01"),
        }),
      );
      expect(result.segment).toBe("at_risk");
    });

    it("uses current date when now is not provided", () => {
      const result = calculateSegment({
        registeredAt: new Date(),
        transactionCount12Months: 0,
        totalSpending12Months: 0,
        lastTransactionAt: null,
        lastCommunicationAt: null,
        vipSpendingThreshold: 15000,
      });
      expect(result.segment).toBe("new");
    });
  });
});
