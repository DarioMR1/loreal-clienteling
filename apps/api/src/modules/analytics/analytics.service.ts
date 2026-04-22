import { Injectable, Inject } from "@nestjs/common";
import { eq, and, gte, sql, count, sum } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import {
  customers,
  purchases,
  recommendations,
  appointments,
  communications,
  samples,
} from "@loreal/database";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    private scopeService: ScopeService,
  ) {}

  async getDashboard(user: SessionUser) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Total customers
    const customerConditions = isAdmin
      ? []
      : [sql`${customers.registeredAtStoreId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})`];

    const [customerCount] = await this.db
      .select({ count: count() })
      .from(customers)
      .where(customerConditions.length > 0 ? and(...customerConditions) : undefined);

    // Sales this month
    const purchaseConditions = [gte(purchases.purchasedAt, monthStart)];
    if (!isAdmin) {
      purchaseConditions.push(
        sql`${purchases.storeId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})` as any,
      );
    }
    const [salesData] = await this.db
      .select({ total: sum(purchases.totalAmount), count: count() })
      .from(purchases)
      .where(and(...purchaseConditions));

    // Appointments this month
    const apptConditions = [gte(appointments.scheduledAt, monthStart)];
    if (!isAdmin) {
      apptConditions.push(
        sql`${appointments.storeId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})` as any,
      );
    }
    const [apptCount] = await this.db
      .select({ count: count() })
      .from(appointments)
      .where(and(...apptConditions));

    // New customers this month
    const newConditions = [gte(customers.customerSince, monthStart)];
    if (!isAdmin) {
      newConditions.push(
        sql`${customers.registeredAtStoreId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})` as any,
      );
    }
    const [newCustomers] = await this.db
      .select({ count: count() })
      .from(customers)
      .where(and(...newConditions));

    return {
      totalCustomers: customerCount?.count ?? 0,
      salesThisMonth: {
        totalAmount: salesData?.total ?? "0",
        transactionCount: salesData?.count ?? 0,
      },
      appointmentsThisMonth: apptCount?.count ?? 0,
      newCustomersThisMonth: newCustomers?.count ?? 0,
    };
  }

  async getConversion(user: SessionUser) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";

    // Recommendation → purchase conversion
    const recConditions = isAdmin
      ? []
      : [sql`${recommendations.storeId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})`];

    const [recTotal] = await this.db
      .select({ count: count() })
      .from(recommendations)
      .where(recConditions.length > 0 ? and(...recConditions as any) : undefined);

    const [recConverted] = await this.db
      .select({ count: count() })
      .from(recommendations)
      .where(
        and(
          eq(recommendations.convertedToPurchase, true),
          ...(recConditions as any),
        ),
      );

    // Sample → purchase conversion
    const sampleConditions = isAdmin
      ? []
      : [sql`${samples.storeId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})`];

    const [sampleTotal] = await this.db
      .select({ count: count() })
      .from(samples)
      .where(sampleConditions.length > 0 ? and(...sampleConditions as any) : undefined);

    const [sampleConverted] = await this.db
      .select({ count: count() })
      .from(samples)
      .where(
        and(
          eq(samples.convertedToPurchase, true),
          ...(sampleConditions as any),
        ),
      );

    return {
      recommendationToSale: {
        total: recTotal?.count ?? 0,
        converted: recConverted?.count ?? 0,
        rate: recTotal?.count ? (recConverted?.count ?? 0) / recTotal.count : 0,
      },
      sampleToSale: {
        total: sampleTotal?.count ?? 0,
        converted: sampleConverted?.count ?? 0,
        rate: sampleTotal?.count ? (sampleConverted?.count ?? 0) / sampleTotal.count : 0,
      },
    };
  }

  async getCustomerSegments(user: SessionUser) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";

    const conditions = isAdmin
      ? []
      : [sql`${customers.registeredAtStoreId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})`];

    const result = await this.db
      .select({
        segment: customers.lifecycleSegment,
        count: count(),
      })
      .from(customers)
      .where(conditions.length > 0 ? and(...conditions as any) : undefined)
      .groupBy(customers.lifecycleSegment);

    return result;
  }

  async exportData(type: string, user: SessionUser) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";

    if (type === "customers") {
      const conditions = isAdmin
        ? []
        : [sql`${customers.registeredAtStoreId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})`];
      return this.db
        .select()
        .from(customers)
        .where(conditions.length > 0 ? and(...conditions as any) : undefined);
    }

    if (type === "sales") {
      const conditions = isAdmin
        ? []
        : [sql`${purchases.storeId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})`];
      return this.db
        .select()
        .from(purchases)
        .where(conditions.length > 0 ? and(...conditions as any) : undefined);
    }

    if (type === "appointments") {
      const conditions = isAdmin
        ? []
        : [sql`${appointments.storeId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})`];
      return this.db
        .select()
        .from(appointments)
        .where(conditions.length > 0 ? and(...conditions as any) : undefined);
    }

    return [];
  }
}
