import type { FollowupType } from "@loreal/contracts";
import type { ReplenishmentResult } from "../replenishment/calculate-next-purchase";

export interface CustomerForAlerts {
  customerId: string;
  birthDate: Date | null;
  customerSince: Date;
  baUserId: string;
}

export interface LifeEventAlert {
  customerId: string;
  baUserId: string;
  type: FollowupType;
  label: string;
  eventDate: Date;
  daysUntil: number;
}

const DAYS_MS = 24 * 60 * 60 * 1000;
const ALERT_WINDOW_DAYS = 7;

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / DAYS_MS);
}

function getNextOccurrence(
  referenceDate: Date,
  now: Date,
): { date: Date; daysUntil: number } {
  const thisYear = new Date(
    now.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );

  // If this year's occurrence already passed, use next year
  const target = thisYear >= now
    ? thisYear
    : new Date(
        now.getFullYear() + 1,
        referenceDate.getMonth(),
        referenceDate.getDate(),
      );

  return {
    date: target,
    daysUntil: daysBetween(now, target),
  };
}

/**
 * RF-09: Alertas automáticas de eventos de vida.
 *
 * Genera alertas cuando:
 * - Cumpleaños de la clienta está dentro de los próximos 7 días
 * - Aniversario como clienta (customer_since) está dentro de los próximos 7 días
 * - Productos en ventana de reposición (datos de replenishment)
 */
export function generateLifeEventAlerts(
  customer: CustomerForAlerts,
  replenishmentAlerts: ReplenishmentResult[],
  now?: Date,
): LifeEventAlert[] {
  const currentDate = now ?? new Date();
  const alerts: LifeEventAlert[] = [];

  // Birthday alert
  if (customer.birthDate) {
    const { date, daysUntil } = getNextOccurrence(
      customer.birthDate,
      currentDate,
    );
    if (daysUntil >= 0 && daysUntil <= ALERT_WINDOW_DAYS) {
      alerts.push({
        customerId: customer.customerId,
        baUserId: customer.baUserId,
        type: "birthday",
        label:
          daysUntil === 0
            ? "Hoy es su cumpleaños"
            : `Cumpleaños en ${daysUntil} día${daysUntil === 1 ? "" : "s"}`,
        eventDate: date,
        daysUntil,
      });
    }
  }

  // Anniversary alert
  const { date: anniversaryDate, daysUntil: daysUntilAnniversary } =
    getNextOccurrence(customer.customerSince, currentDate);

  // Only alert if customer has been around for at least 1 year
  if (
    currentDate.getFullYear() > customer.customerSince.getFullYear() &&
    daysUntilAnniversary >= 0 &&
    daysUntilAnniversary <= ALERT_WINDOW_DAYS
  ) {
    const years =
      anniversaryDate.getFullYear() - customer.customerSince.getFullYear();
    alerts.push({
      customerId: customer.customerId,
      baUserId: customer.baUserId,
      type: "special_event",
      label:
        daysUntilAnniversary === 0
          ? `Hoy cumple ${years} año${years === 1 ? "" : "s"} como clienta`
          : `Aniversario de ${years} año${years === 1 ? "" : "s"} en ${daysUntilAnniversary} día${daysUntilAnniversary === 1 ? "" : "s"}`,
      eventDate: anniversaryDate,
      daysUntil: daysUntilAnniversary,
    });
  }

  // Replenishment alerts
  for (const replenishment of replenishmentAlerts) {
    if (replenishment.isInWindow) {
      alerts.push({
        customerId: customer.customerId,
        baUserId: customer.baUserId,
        type: "replenishment",
        label:
          replenishment.daysUntilDepletion <= 0
            ? "Producto probablemente agotado"
            : `Producto se agota en ~${replenishment.daysUntilDepletion} días`,
        eventDate: replenishment.estimatedDepletionDate,
        daysUntil: Math.max(0, replenishment.daysUntilDepletion),
      });
    }
  }

  return alerts;
}
