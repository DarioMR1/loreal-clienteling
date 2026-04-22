import { Injectable, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import {
  customers,
  purchases,
  purchaseItems,
  products,
  communications,
} from "@loreal/database";
import {
  generateLifeEventAlerts,
  calculateNextPurchase,
  type ReplenishmentResult,
} from "@loreal/domain";
import { eq, sql, and, isNotNull } from "drizzle-orm";
import { AuditService } from "../../common/services/audit.service";

@Injectable()
export class LifecycleAlertsCron {
  private readonly logger = new Logger(LifecycleAlertsCron.name);

  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    private auditService: AuditService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async generateAlerts(): Promise<void> {
    this.logger.log("Generando alertas de eventos de vida...");

    const now = new Date();

    // Fetch all customers with their assigned BA
    const allCustomers = await this.db
      .select({
        id: customers.id,
        birthDate: customers.birthDate,
        customerSince: customers.customerSince,
        lastBaUserId: customers.lastBaUserId,
        registeredByUserId: customers.registeredByUserId,
      })
      .from(customers);

    let totalAlerts = 0;

    for (const customer of allCustomers) {
      const baUserId = customer.lastBaUserId ?? customer.registeredByUserId;

      // Calculate replenishment alerts for this customer
      const replenishmentAlerts = await this.getReplenishmentAlerts(
        customer.id,
        now,
      );

      const alerts = generateLifeEventAlerts(
        {
          customerId: customer.id,
          birthDate: customer.birthDate ? new Date(customer.birthDate) : null,
          customerSince: customer.customerSince,
          baUserId,
        },
        replenishmentAlerts,
        now,
      );

      // Persist alerts as communications (so they show up in the BA's workflow)
      for (const alert of alerts) {
        // Check if a similar alert was already sent recently (avoid duplicates)
        const [existing] = await this.db
          .select({ id: communications.id })
          .from(communications)
          .where(
            and(
              eq(communications.customerId, alert.customerId),
              eq(communications.followupType, alert.type),
              eq(communications.channel, "email"),
              sql`${communications.sentAt} > now() - interval '7 days'`,
            ),
          )
          .limit(1);

        if (existing) continue;

        await this.db.insert(communications).values({
          customerId: alert.customerId,
          sentByUserId: alert.baUserId,
          channel: "email",
          body: alert.label,
          followupType: alert.type,
          sentAt: now,
        });

        totalAlerts++;
      }
    }

    this.logger.log(`Alertas generadas: ${totalAlerts}`);
  }

  private async getReplenishmentAlerts(
    customerId: string,
    now: Date,
  ): Promise<ReplenishmentResult[]> {
    // Get all purchased products for this customer with their duration info
    const customerPurchases = await this.db
      .select({
        purchasedAt: purchases.purchasedAt,
        productId: purchaseItems.productId,
        estimatedDurationDays: products.estimatedDurationDays,
      })
      .from(purchases)
      .innerJoin(purchaseItems, eq(purchaseItems.purchaseId, purchases.id))
      .innerJoin(products, eq(products.id, purchaseItems.productId))
      .where(
        and(
          eq(purchases.customerId, customerId),
          isNotNull(products.estimatedDurationDays),
        ),
      );

    if (customerPurchases.length === 0) return [];

    // Group by product and calculate replenishment for each
    const byProduct = new Map<
      string,
      { purchasedAt: Date; estimatedDurationDays: number }[]
    >();

    for (const row of customerPurchases) {
      const list = byProduct.get(row.productId) ?? [];
      list.push({
        purchasedAt: row.purchasedAt,
        estimatedDurationDays: row.estimatedDurationDays!,
      });
      byProduct.set(row.productId, list);
    }

    const results: ReplenishmentResult[] = [];

    for (const [productId, rows] of byProduct) {
      const result = calculateNextPurchase({
        productId,
        estimatedDurationDays: rows[0].estimatedDurationDays,
        purchaseHistory: rows.map((r) => ({
          purchasedAt: r.purchasedAt,
          productId,
        })),
        now,
      });

      if (result?.isInWindow) {
        results.push(result);
      }
    }

    return results;
  }
}
