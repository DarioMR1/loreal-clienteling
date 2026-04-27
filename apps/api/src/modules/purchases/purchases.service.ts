import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, and } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { purchases, purchaseItems, customers } from "@loreal/database";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";
import { AuditService } from "../../common/services/audit.service";
import { RecommendationsService } from "../recommendations/recommendations.service";
import {
  attributePurchaseToBa,
  type RecommendationRecord,
} from "@loreal/domain";
import type { CreatePurchase } from "@loreal/contracts";

@Injectable()
export class PurchasesService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    @Inject(ScopeService) private scopeService: ScopeService,
    @Inject(AuditService) private auditService: AuditService,
    @Inject(RecommendationsService) private recommendationsService: RecommendationsService,
  ) {}

  async findByCustomer(customerId: string, user: SessionUser) {
    const storeScope = await this.scopeService.scopeByStore(
      user,
      purchases.storeId,
    );

    const conditions = [
      eq(purchases.customerId, customerId),
      ...(storeScope ? [storeScope] : []),
    ];

    const rows = await this.db
      .select()
      .from(purchases)
      .where(and(...conditions))
      .orderBy(purchases.purchasedAt);

    // Attach items to each purchase
    const result = await Promise.all(
      rows.map(async (purchase) => {
        const items = await this.db
          .select()
          .from(purchaseItems)
          .where(eq(purchaseItems.purchaseId, purchase.id));
        return { ...purchase, items };
      }),
    );

    return result;
  }

  async findOne(id: string) {
    const [purchase] = await this.db
      .select()
      .from(purchases)
      .where(eq(purchases.id, id));

    if (!purchase) throw new NotFoundException("Purchase not found");

    const items = await this.db
      .select()
      .from(purchaseItems)
      .where(eq(purchaseItems.purchaseId, id));

    return { ...purchase, items };
  }

  async create(data: CreatePurchase, user: SessionUser) {
    const storeId = this.scopeService.assertStore(user);

    // a. Fetch customer
    const [customer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, data.customerId));

    if (!customer) throw new NotFoundException("Customer not found");

    // b. Fetch active recommendations (last 30 days)
    const activeRecs = await this.recommendationsService.findActiveForCustomer(
      data.customerId,
      30,
    );

    const activeRecommendations: RecommendationRecord[] = activeRecs.map(
      (r) => ({
        baUserId: r.baUserId,
        productId: r.productId,
        recommendedAt: r.recommendedAt,
        recommendationId: r.id,
      }),
    );

    // c. Call attribution logic
    const purchasedProductIds = data.items.map((item) => item.productId);
    const attribution = attributePurchaseToBa({
      customerId: data.customerId,
      purchasedProductIds,
      purchasedAt: new Date(),
      lastBaUserId: customer.lastBaUserId,
      lastContactAt: customer.lastContactAt,
      activeRecommendations,
    });

    // d. Insert purchase
    const [purchase] = await this.db
      .insert(purchases)
      .values({
        customerId: data.customerId,
        storeId,
        totalAmount: String(data.totalAmount),
        posTransactionId: data.posTransactionId,
        source: data.source,
        attributedBaUserId: attribution.attributedBaUserId,
        attributionReason: attribution.attributionReason,
      })
      .returning();

    // e. Insert purchase items
    const itemRows = await Promise.all(
      data.items.map((item) =>
        this.db
          .insert(purchaseItems)
          .values({
            purchaseId: purchase.id,
            productId: item.productId,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: String(item.unitPrice),
          })
          .returning()
          .then(([row]) => row),
      ),
    );

    // f. If matched recommendation, mark it as converted
    if (attribution.matchedRecommendationId) {
      await this.recommendationsService.markConverted(
        attribution.matchedRecommendationId,
        purchase.id,
      );
    }

    // g. Update customer.lastTransactionAt
    await this.db
      .update(customers)
      .set({ lastTransactionAt: new Date(), updatedAt: new Date() })
      .where(eq(customers.id, data.customerId));

    await this.auditService.log(user, "create", "purchase", purchase.id, {
      customerId: data.customerId,
      totalAmount: data.totalAmount,
      source: data.source,
      attributedBaUserId: attribution.attributedBaUserId,
      attributionReason: attribution.attributionReason,
    });

    // h. Return purchase with items
    return { ...purchase, items: itemRows };
  }
}
