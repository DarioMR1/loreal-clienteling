export interface PurchaseRecord {
  purchasedAt: Date;
  productId: string;
}

export interface ReplenishmentInput {
  productId: string;
  estimatedDurationDays: number;
  purchaseHistory: PurchaseRecord[];
  now?: Date;
}

export interface ReplenishmentResult {
  productId: string;
  estimatedDepletionDate: Date;
  windowStart: Date;
  windowEnd: Date;
  isInWindow: boolean;
  isPastWindow: boolean;
  averageIntervalDays: number | null;
  daysUntilDepletion: number;
}

const DAYS_MS = 24 * 60 * 60 * 1000;
const WINDOW_BEFORE_DAYS = 15;
const WINDOW_AFTER_DAYS = 30;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAYS_MS);
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / DAYS_MS);
}

/**
 * RF-16: Lógica de reposición.
 *
 * Calcula cuándo la clienta agotará un producto y si está en la ventana de recompra.
 * Si hay múltiples compras del mismo producto, promedia el intervalo real de recompra.
 */
export function calculateNextPurchase(
  input: ReplenishmentInput,
): ReplenishmentResult | null {
  const now = input.now ?? new Date();

  // Filter purchases for this specific product and sort ascending
  const productPurchases = input.purchaseHistory
    .filter((p) => p.productId === input.productId)
    .sort((a, b) => a.purchasedAt.getTime() - b.purchasedAt.getTime());

  if (productPurchases.length === 0) {
    return null;
  }

  // Calculate average repurchase interval if there are multiple purchases
  let averageIntervalDays: number | null = null;

  if (productPurchases.length >= 2) {
    const intervals: number[] = [];
    for (let i = 1; i < productPurchases.length; i++) {
      intervals.push(
        daysBetween(
          productPurchases[i - 1].purchasedAt,
          productPurchases[i].purchasedAt,
        ),
      );
    }
    averageIntervalDays = Math.round(
      intervals.reduce((sum, d) => sum + d, 0) / intervals.length,
    );
  }

  // Use the most recent purchase as baseline
  const lastPurchase = productPurchases[productPurchases.length - 1];

  // Duration: prefer historical average if available, otherwise product estimate
  const effectiveDuration = averageIntervalDays ?? input.estimatedDurationDays;

  const estimatedDepletionDate = addDays(
    lastPurchase.purchasedAt,
    effectiveDuration,
  );
  const windowStart = addDays(estimatedDepletionDate, -WINDOW_BEFORE_DAYS);
  const windowEnd = addDays(estimatedDepletionDate, WINDOW_AFTER_DAYS);

  const daysUntilDepletion = daysBetween(now, estimatedDepletionDate);

  return {
    productId: input.productId,
    estimatedDepletionDate,
    windowStart,
    windowEnd,
    isInWindow: now >= windowStart && now <= windowEnd,
    isPastWindow: now > windowEnd,
    averageIntervalDays,
    daysUntilDepletion,
  };
}
