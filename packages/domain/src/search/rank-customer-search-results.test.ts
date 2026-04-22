import {
  rankCustomerSearchResults,
  CustomerSearchRecord,
} from "./rank-customer-search-results";

const BASE_DATE = new Date("2026-04-21");
const SEARCHING_BA = "ba-1";

function makeCustomer(
  overrides: Partial<CustomerSearchRecord>,
): CustomerSearchRecord {
  return {
    customerId: "customer-1",
    firstName: "María",
    lastName: "García",
    lastContactAt: null,
    lastTransactionAt: null,
    lastBaUserId: null,
    lifecycleSegment: "returning",
    textMatchScore: 80,
    ...overrides,
  };
}

describe("rankCustomerSearchResults", () => {
  it("ranks by text match score when all else is equal", () => {
    const results = rankCustomerSearchResults({
      results: [
        makeCustomer({ customerId: "c1", textMatchScore: 60 }),
        makeCustomer({ customerId: "c2", textMatchScore: 90 }),
        makeCustomer({ customerId: "c3", textMatchScore: 75 }),
      ],
      searchingBaUserId: SEARCHING_BA,
      now: BASE_DATE,
    });

    expect(results[0].customer.customerId).toBe("c2");
    expect(results[1].customer.customerId).toBe("c3");
    expect(results[2].customer.customerId).toBe("c1");
  });

  it("boosts customers recently contacted by the searching BA", () => {
    const results = rankCustomerSearchResults({
      results: [
        makeCustomer({
          customerId: "c1",
          textMatchScore: 80,
          lastBaUserId: SEARCHING_BA,
        }),
        makeCustomer({
          customerId: "c2",
          textMatchScore: 90,
          lastBaUserId: "other-ba",
        }),
      ],
      searchingBaUserId: SEARCHING_BA,
      now: BASE_DATE,
    });

    // c1 gets +30 BA affinity bonus: 80 + 30 + 10 = 120
    // c2: 90 + 10 = 100
    expect(results[0].customer.customerId).toBe("c1");
  });

  it("adds recency bonus for recent contacts", () => {
    const results = rankCustomerSearchResults({
      results: [
        makeCustomer({
          customerId: "c1",
          textMatchScore: 80,
          lastContactAt: new Date("2026-04-20"), // 1 day ago
        }),
        makeCustomer({
          customerId: "c2",
          textMatchScore: 80,
          lastContactAt: null,
        }),
      ],
      searchingBaUserId: SEARCHING_BA,
      now: BASE_DATE,
    });

    expect(results[0].customer.customerId).toBe("c1");
    expect(results[0].finalScore).toBeGreaterThan(results[1].finalScore);
  });

  it("adds transaction recency bonus", () => {
    const results = rankCustomerSearchResults({
      results: [
        makeCustomer({
          customerId: "c1",
          textMatchScore: 80,
          lastTransactionAt: new Date("2026-04-15"), // 6 days ago
        }),
        makeCustomer({
          customerId: "c2",
          textMatchScore: 80,
          lastTransactionAt: null,
        }),
      ],
      searchingBaUserId: SEARCHING_BA,
      now: BASE_DATE,
    });

    expect(results[0].customer.customerId).toBe("c1");
  });

  it("weights VIP customers higher than other segments", () => {
    const results = rankCustomerSearchResults({
      results: [
        makeCustomer({
          customerId: "c-new",
          textMatchScore: 80,
          lifecycleSegment: "new",
        }),
        makeCustomer({
          customerId: "c-vip",
          textMatchScore: 80,
          lifecycleSegment: "vip",
        }),
      ],
      searchingBaUserId: SEARCHING_BA,
      now: BASE_DATE,
    });

    expect(results[0].customer.customerId).toBe("c-vip");
  });

  it("weights at_risk customers higher than returning", () => {
    const results = rankCustomerSearchResults({
      results: [
        makeCustomer({
          customerId: "c-returning",
          textMatchScore: 80,
          lifecycleSegment: "returning",
        }),
        makeCustomer({
          customerId: "c-at-risk",
          textMatchScore: 80,
          lifecycleSegment: "at_risk",
        }),
      ],
      searchingBaUserId: SEARCHING_BA,
      now: BASE_DATE,
    });

    expect(results[0].customer.customerId).toBe("c-at-risk");
  });

  it("returns empty array for empty input", () => {
    const results = rankCustomerSearchResults({
      results: [],
      searchingBaUserId: SEARCHING_BA,
      now: BASE_DATE,
    });

    expect(results).toEqual([]);
  });

  it("no recency bonus for contacts older than 30 days", () => {
    const results = rankCustomerSearchResults({
      results: [
        makeCustomer({
          customerId: "c1",
          textMatchScore: 80,
          lastContactAt: new Date("2026-03-01"),
        }),
        makeCustomer({
          customerId: "c2",
          textMatchScore: 80,
          lastContactAt: null,
        }),
      ],
      searchingBaUserId: SEARCHING_BA,
      now: BASE_DATE,
    });

    // Both should have same segment bonus, no contact recency for c1
    expect(results[0].finalScore).toBe(results[1].finalScore);
  });

  it("combines all scoring factors correctly", () => {
    const results = rankCustomerSearchResults({
      results: [
        makeCustomer({
          customerId: "perfect",
          textMatchScore: 95,
          lastContactAt: new Date("2026-04-20"),
          lastTransactionAt: new Date("2026-04-18"),
          lastBaUserId: SEARCHING_BA,
          lifecycleSegment: "vip",
        }),
      ],
      searchingBaUserId: SEARCHING_BA,
      now: BASE_DATE,
    });

    // 95 (text) + ~24 (contact 1d ago) + ~14 (tx 3d ago) + 30 (BA) + 20 (VIP) ≈ 183
    expect(results[0].finalScore).toBeGreaterThan(150);
  });
});
