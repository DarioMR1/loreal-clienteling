import type { LifecycleSegment } from "@loreal/contracts";

export interface SegmentationInput {
  registeredAt: Date;
  transactionCount12Months: number;
  totalSpending12Months: number;
  lastTransactionAt: Date | null;
  lastCommunicationAt: Date | null;
  vipSpendingThreshold: number;
  now?: Date;
}

export interface SegmentationResult {
  segment: LifecycleSegment;
  inactive: boolean;
  reason: string;
}

const DAYS_MS = 24 * 60 * 60 * 1000;

function daysBetween(a: Date, b: Date): number {
  return Math.floor(Math.abs(b.getTime() - a.getTime()) / DAYS_MS);
}

/**
 * RF-11: Segmentación automática del ciclo de vida.
 *
 * Reglas (evaluadas en orden de prioridad):
 * - new: registrada hace <30 días sin segunda visita
 * - vip: ≥6 transacciones en 12 meses O spending > umbral por marca
 * - returning: entre 2 y 5 transacciones en últimos 12 meses
 * - at_risk: última transacción entre 120 y 365 días atrás
 *   - Si >365 días sin respuesta a seguimientos: at_risk + inactive
 */
export function calculateSegment(input: SegmentationInput): SegmentationResult {
  const now = input.now ?? new Date();
  const daysSinceRegistration = daysBetween(input.registeredAt, now);

  // New: registered less than 30 days ago with fewer than 2 transactions
  if (daysSinceRegistration < 30 && input.transactionCount12Months < 2) {
    return {
      segment: "new",
      inactive: false,
      reason: "Registrada hace menos de 30 días sin segunda visita",
    };
  }

  // VIP: ≥6 transactions in 12 months OR spending above threshold
  if (
    input.transactionCount12Months >= 6 ||
    input.totalSpending12Months > input.vipSpendingThreshold
  ) {
    return {
      segment: "vip",
      inactive: false,
      reason:
        input.transactionCount12Months >= 6
          ? `${input.transactionCount12Months} transacciones en 12 meses`
          : `Gasto $${input.totalSpending12Months.toFixed(2)} supera umbral VIP`,
    };
  }

  // At-risk evaluation based on last transaction date
  if (input.lastTransactionAt) {
    const daysSinceLastTx = daysBetween(input.lastTransactionAt, now);

    if (daysSinceLastTx > 365) {
      // Over a year without transaction — at_risk + potentially inactive
      const hasRecentFollowup =
        input.lastCommunicationAt !== null &&
        daysBetween(input.lastCommunicationAt, now) < 90;

      return {
        segment: "at_risk",
        inactive: !hasRecentFollowup,
        reason: `Sin transacción hace ${daysSinceLastTx} días${!hasRecentFollowup ? ", sin seguimiento reciente" : ""}`,
      };
    }

    if (daysSinceLastTx >= 120) {
      return {
        segment: "at_risk",
        inactive: false,
        reason: `Última transacción hace ${daysSinceLastTx} días`,
      };
    }
  }

  // Returning: between 2 and 5 transactions in 12 months
  if (
    input.transactionCount12Months >= 2 &&
    input.transactionCount12Months <= 5
  ) {
    return {
      segment: "returning",
      inactive: false,
      reason: `${input.transactionCount12Months} transacciones en 12 meses`,
    };
  }

  // No transaction at all — check if registered long ago
  if (!input.lastTransactionAt && daysSinceRegistration >= 30) {
    return {
      segment: "at_risk",
      inactive: daysSinceRegistration > 365,
      reason: "Sin transacciones registradas",
    };
  }

  // Default: new (recently registered, low activity)
  return {
    segment: "new",
    inactive: false,
    reason: "Recién registrada con actividad mínima",
  };
}
