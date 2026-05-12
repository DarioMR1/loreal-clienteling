import { Injectable, Inject } from "@nestjs/common";
import { eq, and, gte, lte, sql, count, sum } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import {
  customers,
  purchases,
  purchaseItems,
  recommendations,
  appointments,
  communications,
  samples,
  products,
  users,
} from "@loreal/database";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";

interface DateRange {
  from?: Date;
  to?: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    @Inject(ScopeService) private scopeService: ScopeService,
  ) {}

  private getDefaultDateRange(range?: DateRange): { from: Date; to: Date } {
    const to = range?.to ?? new Date();
    const from = range?.from ?? (() => {
      const d = new Date();
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d;
    })();
    return { from, to };
  }

  private buildStoreFilter(isAdmin: boolean, storeIds: string[], storeIdColumn: any) {
    if (isAdmin) return undefined;
    return sql`${storeIdColumn} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})`;
  }

  async getDashboard(user: SessionUser, range?: DateRange) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";
    const { from, to } = this.getDefaultDateRange(range);
    const storeFilter = this.buildStoreFilter(isAdmin, storeIds, customers.registeredAtStoreId);

    // Total customers
    const customerConditions = storeFilter ? [storeFilter] : [];
    const [customerCount] = await this.db
      .select({ count: count() })
      .from(customers)
      .where(customerConditions.length > 0 ? and(...customerConditions) : undefined);

    // Sales in period
    const purchaseConditions = [gte(purchases.purchasedAt, from), lte(purchases.purchasedAt, to)];
    const purchaseStoreFilter = this.buildStoreFilter(isAdmin, storeIds, purchases.storeId);
    if (purchaseStoreFilter) purchaseConditions.push(purchaseStoreFilter as any);

    const [salesData] = await this.db
      .select({ total: sum(purchases.totalAmount), count: count() })
      .from(purchases)
      .where(and(...purchaseConditions));

    // Appointments in period
    const apptConditions = [gte(appointments.scheduledAt, from), lte(appointments.scheduledAt, to)];
    const apptStoreFilter = this.buildStoreFilter(isAdmin, storeIds, appointments.storeId);
    if (apptStoreFilter) apptConditions.push(apptStoreFilter as any);

    const [apptCount] = await this.db
      .select({ count: count() })
      .from(appointments)
      .where(and(...apptConditions));

    // New customers in period
    const newConditions = [gte(customers.customerSince, from), lte(customers.customerSince, to)];
    if (storeFilter) newConditions.push(storeFilter as any);

    const [newCustomers] = await this.db
      .select({ count: count() })
      .from(customers)
      .where(and(...newConditions));

    // Communications in period
    const commConditions = [gte(communications.sentAt, from), lte(communications.sentAt, to)];
    const commUserFilter = isAdmin ? undefined : eq(communications.sentByUserId, user.id);
    if (commUserFilter) commConditions.push(commUserFilter as any);

    const [commCount] = await this.db
      .select({ count: count() })
      .from(communications)
      .where(and(...commConditions));

    return {
      totalCustomers: customerCount?.count ?? 0,
      sales: {
        totalAmount: salesData?.total ?? "0",
        transactionCount: salesData?.count ?? 0,
      },
      appointments: apptCount?.count ?? 0,
      newCustomers: newCustomers?.count ?? 0,
      communicationsSent: commCount?.count ?? 0,
      period: { from, to },
    };
  }

  async getAppointmentMetrics(user: SessionUser, range?: DateRange) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";
    const { from, to } = this.getDefaultDateRange(range);

    const baseConditions = [gte(appointments.scheduledAt, from), lte(appointments.scheduledAt, to)];
    const storeFilter = this.buildStoreFilter(isAdmin, storeIds, appointments.storeId);
    if (storeFilter) baseConditions.push(storeFilter as any);

    const result = await this.db
      .select({
        status: appointments.status,
        count: count(),
      })
      .from(appointments)
      .where(and(...baseConditions))
      .groupBy(appointments.status);

    const statusMap: Record<string, number> = {};
    for (const row of result) {
      statusMap[row.status] = row.count;
    }

    return {
      total: Object.values(statusMap).reduce((a, b) => a + b, 0),
      scheduled: statusMap["scheduled"] ?? 0,
      confirmed: statusMap["confirmed"] ?? 0,
      completed: statusMap["completed"] ?? 0,
      rescheduled: statusMap["rescheduled"] ?? 0,
      cancelled: statusMap["cancelled"] ?? 0,
      noShow: statusMap["no_show"] ?? 0,
      period: { from, to },
    };
  }

  async getBaPerformance(user: SessionUser, range?: DateRange) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";
    const { from, to } = this.getDefaultDateRange(range);

    // Get BAs accessible to this user
    const baConditions = [eq(users.role, "ba"), eq(users.active, true)];
    if (!isAdmin && storeIds.length > 0) {
      baConditions.push(
        sql`${users.storeId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})` as any,
      );
    }

    const bas = await this.db
      .select({ id: users.id, fullName: users.fullName, storeId: users.storeId })
      .from(users)
      .where(and(...baConditions));

    if (bas.length === 0) return [];

    const baIds = bas.map((b) => b.id);

    // Sales per BA
    const salesRows = await this.db
      .select({
        baId: purchases.attributedBaUserId,
        totalAmount: sum(purchases.totalAmount),
        transactionCount: count(),
      })
      .from(purchases)
      .where(
        and(
          sql`${purchases.attributedBaUserId} IN (${sql.join(baIds.map((id) => sql`${id}`), sql`, `)})`,
          gte(purchases.purchasedAt, from),
          lte(purchases.purchasedAt, to),
        ),
      )
      .groupBy(purchases.attributedBaUserId);

    const salesMap = new Map(salesRows.map((r) => [r.baId, r]));

    // Registrations per BA
    const regRows = await this.db
      .select({
        baId: customers.registeredByUserId,
        count: count(),
      })
      .from(customers)
      .where(
        and(
          sql`${customers.registeredByUserId} IN (${sql.join(baIds.map((id) => sql`${id}`), sql`, `)})`,
          gte(customers.customerSince, from),
          lte(customers.customerSince, to),
        ),
      )
      .groupBy(customers.registeredByUserId);

    const regMap = new Map(regRows.map((r) => [r.baId, r.count]));

    // Communications per BA
    const commRows = await this.db
      .select({
        baId: communications.sentByUserId,
        count: count(),
      })
      .from(communications)
      .where(
        and(
          sql`${communications.sentByUserId} IN (${sql.join(baIds.map((id) => sql`${id}`), sql`, `)})`,
          gte(communications.sentAt, from),
          lte(communications.sentAt, to),
        ),
      )
      .groupBy(communications.sentByUserId);

    const commMap = new Map(commRows.map((r) => [r.baId, r.count]));

    // Recommendations per BA (total and converted)
    const recRows = await this.db
      .select({
        baId: recommendations.baUserId,
        total: count(),
        converted: sql<number>`COUNT(*) FILTER (WHERE ${recommendations.convertedToPurchase} = true)`,
      })
      .from(recommendations)
      .where(
        and(
          sql`${recommendations.baUserId} IN (${sql.join(baIds.map((id) => sql`${id}`), sql`, `)})`,
          gte(recommendations.recommendedAt, from),
          lte(recommendations.recommendedAt, to),
        ),
      )
      .groupBy(recommendations.baUserId);

    const recMap = new Map(recRows.map((r) => [r.baId, r]));

    return bas.map((ba) => {
      const sales = salesMap.get(ba.id);
      const recs = recMap.get(ba.id);
      const totalRecs = recs?.total ?? 0;
      const convertedRecs = recs?.converted ?? 0;

      return {
        baId: ba.id,
        fullName: ba.fullName,
        storeId: ba.storeId,
        sales: {
          totalAmount: sales?.totalAmount ?? "0",
          transactionCount: sales?.transactionCount ?? 0,
        },
        registrations: regMap.get(ba.id) ?? 0,
        communicationsSent: commMap.get(ba.id) ?? 0,
        recommendations: {
          total: totalRecs,
          converted: convertedRecs,
          conversionRate: totalRecs > 0 ? convertedRecs / totalRecs : 0,
        },
      };
    });
  }

  async getSalesTrend(
    user: SessionUser,
    interval: "day" | "week" | "month",
    range?: DateRange,
  ) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";

    // Default to last 6 months for trend
    const to = range?.to ?? new Date();
    const from = range?.from ?? (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 6);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d;
    })();

    const conditions = [gte(purchases.purchasedAt, from), lte(purchases.purchasedAt, to)];
    const storeFilter = this.buildStoreFilter(isAdmin, storeIds, purchases.storeId);
    if (storeFilter) conditions.push(storeFilter as any);

    const dateTrunc = sql`date_trunc(${sql.raw(`'${interval}'`)}, ${purchases.purchasedAt})`;

    const rows = await this.db
      .select({
        period: dateTrunc.as("period"),
        totalAmount: sum(purchases.totalAmount),
        transactionCount: count(),
      })
      .from(purchases)
      .where(and(...conditions))
      .groupBy(dateTrunc)
      .orderBy(dateTrunc);

    return {
      interval,
      data: rows.map((r) => ({
        date: r.period,
        totalAmount: r.totalAmount ?? "0",
        transactionCount: r.transactionCount,
      })),
      period: { from, to },
    };
  }

  async getSalesBreakdown(
    user: SessionUser,
    groupBy: "category" | "brand",
    range?: DateRange,
  ) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";
    const { from, to } = this.getDefaultDateRange(range);

    const conditions = [gte(purchases.purchasedAt, from), lte(purchases.purchasedAt, to)];
    const storeFilter = this.buildStoreFilter(isAdmin, storeIds, purchases.storeId);
    if (storeFilter) conditions.push(storeFilter as any);

    if (groupBy === "category") {
      const rows = await this.db
        .select({
          category: products.category,
          totalAmount: sum(purchaseItems.unitPrice),
          itemCount: count(),
        })
        .from(purchaseItems)
        .innerJoin(purchases, eq(purchaseItems.purchaseId, purchases.id))
        .innerJoin(products, eq(purchaseItems.productId, products.id))
        .where(and(...conditions))
        .groupBy(products.category);

      return { groupBy: "category", data: rows, period: { from, to } };
    }

    // groupBy === "brand"
    const rows = await this.db
      .select({
        brandId: products.brandId,
        totalAmount: sum(purchaseItems.unitPrice),
        itemCount: count(),
      })
      .from(purchaseItems)
      .innerJoin(purchases, eq(purchaseItems.purchaseId, purchases.id))
      .innerJoin(products, eq(purchaseItems.productId, products.id))
      .where(and(...conditions))
      .groupBy(products.brandId);

    return { groupBy: "brand", data: rows, period: { from, to } };
  }

  async getConversion(user: SessionUser, range?: DateRange) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";
    const { from, to } = this.getDefaultDateRange(range);

    // Recommendation → purchase conversion
    const recConditions: any[] = [
      gte(recommendations.recommendedAt, from),
      lte(recommendations.recommendedAt, to),
    ];
    const recStoreFilter = this.buildStoreFilter(isAdmin, storeIds, recommendations.storeId);
    if (recStoreFilter) recConditions.push(recStoreFilter);

    const [recTotal] = await this.db
      .select({ count: count() })
      .from(recommendations)
      .where(and(...recConditions));

    const [recConverted] = await this.db
      .select({ count: count() })
      .from(recommendations)
      .where(and(eq(recommendations.convertedToPurchase, true), ...recConditions));

    // Sample → purchase conversion
    const sampleConditions: any[] = [
      gte(samples.deliveredAt, from),
      lte(samples.deliveredAt, to),
    ];
    const sampleStoreFilter = this.buildStoreFilter(isAdmin, storeIds, samples.storeId);
    if (sampleStoreFilter) sampleConditions.push(sampleStoreFilter);

    const [sampleTotal] = await this.db
      .select({ count: count() })
      .from(samples)
      .where(and(...sampleConditions));

    const [sampleConverted] = await this.db
      .select({ count: count() })
      .from(samples)
      .where(and(eq(samples.convertedToPurchase, true), ...sampleConditions));

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
      period: { from, to },
    };
  }

  async getCustomerSegments(user: SessionUser) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";
    const storeFilter = this.buildStoreFilter(isAdmin, storeIds, customers.registeredAtStoreId);

    const conditions = storeFilter ? [storeFilter] : [];

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

  async exportData(type: string, user: SessionUser, range?: DateRange) {
    const storeIds = await this.scopeService.getAccessibleStoreIds(user);
    const isAdmin = user.role === "admin";
    const { from, to } = this.getDefaultDateRange(range);

    if (type === "customers") {
      const conditions: any[] = [];
      const storeFilter = this.buildStoreFilter(isAdmin, storeIds, customers.registeredAtStoreId);
      if (storeFilter) conditions.push(storeFilter);
      return this.db
        .select()
        .from(customers)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
    }

    if (type === "sales") {
      const conditions: any[] = [gte(purchases.purchasedAt, from), lte(purchases.purchasedAt, to)];
      const storeFilter = this.buildStoreFilter(isAdmin, storeIds, purchases.storeId);
      if (storeFilter) conditions.push(storeFilter);
      return this.db
        .select()
        .from(purchases)
        .where(and(...conditions));
    }

    if (type === "appointments") {
      const conditions: any[] = [gte(appointments.scheduledAt, from), lte(appointments.scheduledAt, to)];
      const storeFilter = this.buildStoreFilter(isAdmin, storeIds, appointments.storeId);
      if (storeFilter) conditions.push(storeFilter);
      return this.db
        .select()
        .from(appointments)
        .where(and(...conditions));
    }

    return [];
  }
}
