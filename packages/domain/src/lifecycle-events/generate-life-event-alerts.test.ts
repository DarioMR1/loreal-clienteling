import {
  generateLifeEventAlerts,
  CustomerForAlerts,
} from "./generate-life-event-alerts";
import type { ReplenishmentResult } from "../replenishment/calculate-next-purchase";

const BASE_DATE = new Date(2026, 3, 21); // April 21, 2026 in local time

function makeCustomer(
  overrides: Partial<CustomerForAlerts>,
): CustomerForAlerts {
  return {
    customerId: "customer-1",
    birthDate: null,
    customerSince: new Date(2024, 5, 15),
    baUserId: "ba-1",
    ...overrides,
  };
}

function makeReplenishment(
  overrides: Partial<ReplenishmentResult>,
): ReplenishmentResult {
  return {
    productId: "product-1",
    estimatedDepletionDate: new Date(2026, 3, 25),
    windowStart: new Date(2026, 3, 10),
    windowEnd: new Date(2026, 4, 25),
    isInWindow: true,
    isPastWindow: false,
    averageIntervalDays: null,
    daysUntilDepletion: 4,
    ...overrides,
  };
}

describe("generateLifeEventAlerts", () => {
  describe("birthday alerts", () => {
    it("generates alert when birthday is within 7 days", () => {
      const customer = makeCustomer({
        birthDate: new Date(1990, 3, 25),
      });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);

      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe("birthday");
      expect(alerts[0].daysUntil).toBe(4);
      expect(alerts[0].label).toContain("4 días");
    });

    it("generates alert on the exact birthday", () => {
      const customer = makeCustomer({
        birthDate: new Date(1990, 3, 21),
      });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);

      expect(alerts).toHaveLength(1);
      expect(alerts[0].label).toBe("Hoy es su cumpleaños");
      expect(alerts[0].daysUntil).toBe(0);
    });

    it("does not generate alert when birthday is more than 7 days away", () => {
      const customer = makeCustomer({
        birthDate: new Date(1990, 4, 15),
      });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);
      const birthdayAlerts = alerts.filter((a) => a.type === "birthday");

      expect(birthdayAlerts).toHaveLength(0);
    });

    it("does not generate alert when birth date is null", () => {
      const customer = makeCustomer({ birthDate: null });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);
      const birthdayAlerts = alerts.filter((a) => a.type === "birthday");

      expect(birthdayAlerts).toHaveLength(0);
    });

    it("handles birthday that already passed this year (checks next year)", () => {
      const customer = makeCustomer({
        birthDate: new Date(1990, 0, 15),
      });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);
      const birthdayAlerts = alerts.filter((a) => a.type === "birthday");

      // Next occurrence is Jan 15 2027, far away
      expect(birthdayAlerts).toHaveLength(0);
    });

    it("uses singular 'día' for 1 day", () => {
      const customer = makeCustomer({
        birthDate: new Date(1990, 3, 22),
      });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);

      expect(alerts[0].label).toBe("Cumpleaños en 1 día");
    });
  });

  describe("anniversary alerts", () => {
    it("generates alert when anniversary is within 7 days", () => {
      const customer = makeCustomer({
        customerSince: new Date(2024, 3, 25),
      });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);

      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe("special_event");
      expect(alerts[0].label).toContain("2 años");
      expect(alerts[0].daysUntil).toBe(4);
    });

    it("generates alert on the exact anniversary date", () => {
      const customer = makeCustomer({
        customerSince: new Date(2025, 3, 21),
      });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);

      expect(alerts).toHaveLength(1);
      expect(alerts[0].label).toContain("Hoy cumple 1 año como clienta");
    });

    it("does not generate alert for first-year customers", () => {
      const customer = makeCustomer({
        customerSince: new Date(2026, 0, 15),
      });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);
      const anniversaryAlerts = alerts.filter(
        (a) => a.type === "special_event",
      );

      expect(anniversaryAlerts).toHaveLength(0);
    });
  });

  describe("replenishment alerts", () => {
    it("generates alert when product is in repurchase window", () => {
      const customer = makeCustomer({});
      const replenishment = makeReplenishment({
        isInWindow: true,
        daysUntilDepletion: 5,
      });

      const alerts = generateLifeEventAlerts(
        customer,
        [replenishment],
        BASE_DATE,
      );

      const repAlerts = alerts.filter((a) => a.type === "replenishment");
      expect(repAlerts).toHaveLength(1);
      expect(repAlerts[0].label).toContain("5 días");
    });

    it("generates alert for already depleted product", () => {
      const customer = makeCustomer({});
      const replenishment = makeReplenishment({
        isInWindow: true,
        daysUntilDepletion: -5,
      });

      const alerts = generateLifeEventAlerts(
        customer,
        [replenishment],
        BASE_DATE,
      );

      const repAlerts = alerts.filter((a) => a.type === "replenishment");
      expect(repAlerts[0].label).toBe("Producto probablemente agotado");
    });

    it("does not generate alert for products outside window", () => {
      const customer = makeCustomer({});
      const replenishment = makeReplenishment({ isInWindow: false });

      const alerts = generateLifeEventAlerts(
        customer,
        [replenishment],
        BASE_DATE,
      );

      const repAlerts = alerts.filter((a) => a.type === "replenishment");
      expect(repAlerts).toHaveLength(0);
    });

    it("generates multiple replenishment alerts for different products", () => {
      const customer = makeCustomer({});
      const replenishments = [
        makeReplenishment({ productId: "p1", isInWindow: true }),
        makeReplenishment({ productId: "p2", isInWindow: true }),
        makeReplenishment({ productId: "p3", isInWindow: false }),
      ];

      const alerts = generateLifeEventAlerts(
        customer,
        replenishments,
        BASE_DATE,
      );

      const repAlerts = alerts.filter((a) => a.type === "replenishment");
      expect(repAlerts).toHaveLength(2);
    });
  });

  describe("combined alerts", () => {
    it("generates birthday + anniversary + replenishment alerts together", () => {
      const customer = makeCustomer({
        birthDate: new Date(1990, 3, 23),
        customerSince: new Date(2024, 3, 24),
      });
      const replenishment = makeReplenishment({ isInWindow: true });

      const alerts = generateLifeEventAlerts(
        customer,
        [replenishment],
        BASE_DATE,
      );

      expect(alerts).toHaveLength(3);
      expect(alerts.map((a) => a.type).sort()).toEqual([
        "birthday",
        "replenishment",
        "special_event",
      ]);
    });

    it("assigns correct BA to all alerts", () => {
      const customer = makeCustomer({
        baUserId: "ba-specific",
        birthDate: new Date(1990, 3, 22),
      });

      const alerts = generateLifeEventAlerts(customer, [], BASE_DATE);

      expect(alerts[0].baUserId).toBe("ba-specific");
    });
  });
});
