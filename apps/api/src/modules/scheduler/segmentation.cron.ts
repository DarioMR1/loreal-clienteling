import { Injectable, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { customers, purchases, communications, brandConfigs } from "@loreal/database";
import { calculateSegment } from "@loreal/domain";
import { eq, sql, gte, and } from "drizzle-orm";

const DEFAULT_VIP_SPENDING_THRESHOLD = 15_000; // MXN

@Injectable()
export class SegmentationCron {
  private readonly logger = new Logger(SegmentationCron.name);

  constructor(@Inject(DATABASE_TOKEN) private db: Database) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async recalculateSegments(): Promise<void> {
    this.logger.log("Iniciando recalculación de segmentos...");

    const now = new Date();
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

    // Load VIP spending thresholds per brand
    const brandThresholds = await this.loadBrandThresholds();

    // Fetch all active customers with aggregated purchase data
    const allCustomers = await this.db
      .select({
        id: customers.id,
        registeredAtStoreId: customers.registeredAtStoreId,
        customerSince: customers.customerSince,
        lastTransactionAt: customers.lastTransactionAt,
        lifecycleSegment: customers.lifecycleSegment,
        inactive: customers.inactive,
      })
      .from(customers);

    let updated = 0;

    for (const customer of allCustomers) {
      // Count transactions in last 12 months
      const [txResult] = await this.db
        .select({
          count: sql<number>`count(*)::int`,
          total: sql<number>`coalesce(sum(${purchases.totalAmount}), 0)::float`,
        })
        .from(purchases)
        .where(
          and(
            eq(purchases.customerId, customer.id),
            gte(purchases.purchasedAt, twelveMonthsAgo),
          ),
        );

      // Last communication date
      const [commResult] = await this.db
        .select({
          lastSentAt: sql<Date | null>`max(${communications.sentAt})`,
        })
        .from(communications)
        .where(eq(communications.customerId, customer.id));

      // Determine VIP threshold — use brand-specific if available
      const threshold =
        brandThresholds.get(customer.registeredAtStoreId) ??
        DEFAULT_VIP_SPENDING_THRESHOLD;

      const result = calculateSegment({
        registeredAt: customer.customerSince,
        transactionCount12Months: txResult?.count ?? 0,
        totalSpending12Months: txResult?.total ?? 0,
        lastTransactionAt: customer.lastTransactionAt,
        lastCommunicationAt: commResult?.lastSentAt ?? null,
        vipSpendingThreshold: threshold,
        now,
      });

      // Only update if segment or inactive changed
      if (
        result.segment !== customer.lifecycleSegment ||
        result.inactive !== customer.inactive
      ) {
        await this.db
          .update(customers)
          .set({
            lifecycleSegment: result.segment,
            inactive: result.inactive,
            updatedAt: now,
          })
          .where(eq(customers.id, customer.id));

        updated++;
      }
    }

    this.logger.log(
      `Segmentación completada: ${allCustomers.length} evaluadas, ${updated} actualizadas`,
    );
  }

  private async loadBrandThresholds(): Promise<Map<string, number>> {
    const configs = await this.db
      .select({
        brandId: brandConfigs.brandId,
        replenishmentRules: brandConfigs.replenishmentRules,
      })
      .from(brandConfigs);

    const thresholds = new Map<string, number>();
    for (const config of configs) {
      const rules = config.replenishmentRules as Record<string, unknown> | null;
      if (rules && typeof rules === "object" && "vipSpendingThreshold" in rules) {
        thresholds.set(
          config.brandId,
          Number(rules.vipSpendingThreshold) || DEFAULT_VIP_SPENDING_THRESHOLD,
        );
      }
    }
    return thresholds;
  }
}
