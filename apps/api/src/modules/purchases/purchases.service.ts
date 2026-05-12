import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, and, inArray } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { purchases, purchaseItems, customers } from "@loreal/database";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";
import { AuditService } from "../../common/services/audit.service";
import { RecommendationsService } from "../recommendations/recommendations.service";
import { SamplesService } from "../samples/samples.service";
import {
  attributePurchaseToBa,
  type RecommendationRecord,
} from "@loreal/domain";
import type { CreatePurchaseDto } from "../../dtos/purchases.dto";
import { samples } from "@loreal/database";

@Injectable()
export class PurchasesService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    @Inject(ScopeService) private scopeService: ScopeService,
    @Inject(AuditService) private auditService: AuditService,
    @Inject(RecommendationsService) private recommendationsService: RecommendationsService,
    @Inject(SamplesService) private samplesService: SamplesService,
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

    if (rows.length === 0) return [];

    // Fetch all items for these purchases in a single query
    const purchaseIds = rows.map((p) => p.id);
    const allItems = await this.db
      .select()
      .from(purchaseItems)
      .where(inArray(purchaseItems.purchaseId, purchaseIds));

    // Group items by purchaseId
    const itemsByPurchase = new Map<string, typeof allItems>();
    for (const item of allItems) {
      const existing = itemsByPurchase.get(item.purchaseId) ?? [];
      existing.push(item);
      itemsByPurchase.set(item.purchaseId, existing);
    }

    return rows.map((purchase) => ({
      ...purchase,
      items: itemsByPurchase.get(purchase.id) ?? [],
    }));
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

  async create(data: CreatePurchaseDto, user: SessionUser) {
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

    // g. Mark matching unconverted samples as converted
    const unconvertedSamples = await this.db
      .select()
      .from(samples)
      .where(
        and(
          eq(samples.customerId, data.customerId),
          eq(samples.convertedToPurchase, false),
          inArray(samples.productId, purchasedProductIds),
        ),
      );
    for (const sample of unconvertedSamples) {
      await this.samplesService.markConverted(sample.id, purchase.id);
    }

    // h. Update customer.lastTransactionAt
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
