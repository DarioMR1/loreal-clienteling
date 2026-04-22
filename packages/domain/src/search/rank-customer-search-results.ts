import type { LifecycleSegment } from "@loreal/contracts";

export interface CustomerSearchRecord {
  customerId: string;
  firstName: string;
  lastName: string;
  lastContactAt: Date | null;
  lastTransactionAt: Date | null;
  lastBaUserId: string | null;
  lifecycleSegment: LifecycleSegment;
  textMatchScore: number;
}

export interface SearchRankingInput {
  results: CustomerSearchRecord[];
  searchingBaUserId: string;
  now?: Date;
}

export interface RankedSearchResult {
  customer: CustomerSearchRecord;
  finalScore: number;
}

const DAYS_MS = 24 * 60 * 60 * 1000;

// Segment value weights: VIPs and at-risk customers surface higher
const SEGMENT_WEIGHTS: Record<LifecycleSegment, number> = {
  vip: 20,
  at_risk: 15,
  returning: 10,
  new: 5,
};

/**
 * RF-03: Ranking de resultados de búsqueda de clientes.
 *
 * Scoring compuesto:
 * - textMatchScore (0-100): peso del full-text search de Postgres
 * - Recency bonus: interacciones recientes suben posición
 * - BA affinity: si el BA que busca fue el último en atender, bonus
 * - Segment value: VIPs y at_risk suben posición
 */
export function rankCustomerSearchResults(
  input: SearchRankingInput,
): RankedSearchResult[] {
  const now = input.now ?? new Date();

  return input.results
    .map((customer) => {
      let score = customer.textMatchScore;

      // Recency bonus: last contact within 30 days adds up to 25 points
      if (customer.lastContactAt) {
        const daysSinceContact = Math.floor(
          (now.getTime() - customer.lastContactAt.getTime()) / DAYS_MS,
        );
        if (daysSinceContact <= 30) {
          score += Math.round(25 * (1 - daysSinceContact / 30));
        }
      }

      // Transaction recency: last transaction within 90 days adds up to 15 points
      if (customer.lastTransactionAt) {
        const daysSinceTx = Math.floor(
          (now.getTime() - customer.lastTransactionAt.getTime()) / DAYS_MS,
        );
        if (daysSinceTx <= 90) {
          score += Math.round(15 * (1 - daysSinceTx / 90));
        }
      }

      // BA affinity: bonus if the searching BA was the last one to assist
      if (customer.lastBaUserId === input.searchingBaUserId) {
        score += 30;
      }

      // Segment value bonus
      score += SEGMENT_WEIGHTS[customer.lifecycleSegment] ?? 0;

      return { customer, finalScore: score };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
}
