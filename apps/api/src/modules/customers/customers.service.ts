import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, and, or, ilike, sql } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import {
  customers,
  beautyProfiles,
  beautyProfileShades,
  consents,
  purchases,
  recommendations,
  samples,
  appointments,
  communications,
} from "@loreal/database";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";
import { AuditService } from "../../common/services/audit.service";
import type {
  CreateCustomer,
  UpdateCustomer,
  Pagination,
  CustomerFilters,
} from "@loreal/contracts";
import { rankCustomerSearchResults } from "@loreal/domain";

@Injectable()
export class CustomersService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    private scopeService: ScopeService,
    private auditService: AuditService,
  ) {}

  async findAll(
    user: SessionUser,
    pagination: Pagination,
    filters?: CustomerFilters,
  ) {
    const scope = await this.scopeService.scopeByStore(
      user,
      customers.registeredAtStoreId,
    );

    const conditions = [
      eq(customers.inactive, false),
      ...(scope ? [scope] : []),
      ...(filters?.segment
        ? [eq(customers.lifecycleSegment, filters.segment)]
        : []),
      ...(filters?.storeId
        ? [eq(customers.registeredAtStoreId, filters.storeId)]
        : []),
    ];

    const where = conditions.length > 1 ? and(...conditions) : conditions[0];

    const rows = await this.db
      .select()
      .from(customers)
      .where(where)
      .limit(pagination.limit)
      .offset((pagination.page - 1) * pagination.limit);

    return rows;
  }

  async findOne(id: string, user: SessionUser) {
    const [customer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id));
    if (!customer) throw new NotFoundException("Customer not found");

    await this.auditService.log(
      user,
      "customer_viewed",
      "customer",
      customer.id,
    );

    return customer;
  }

  async create(data: CreateCustomer, user: SessionUser) {
    const storeId = this.scopeService.assertStore(user);

    const [customer] = await this.db
      .insert(customers)
      .values({
        ...data,
        birthDate: data.birthDate
          ? data.birthDate.toISOString().split("T")[0]
          : undefined,
        registeredAtStoreId: storeId,
        registeredByUserId: user.id,
        lastBaUserId: user.id,
      })
      .returning();

    return customer;
  }

  async update(id: string, data: UpdateCustomer, user: SessionUser) {
    const [existing] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id));
    if (!existing) throw new NotFoundException("Customer not found");

    const [updated] = await this.db
      .update(customers)
      .set({
        ...data,
        birthDate: data.birthDate
          ? data.birthDate.toISOString().split("T")[0]
          : undefined,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();

    // Build changes diff
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    for (const key of Object.keys(data) as (keyof UpdateCustomer)[]) {
      if (data[key] !== undefined && data[key] !== (existing as any)[key]) {
        changes[key] = { from: (existing as any)[key], to: data[key] };
      }
    }

    if (Object.keys(changes).length > 0) {
      await this.auditService.log(
        user,
        "customer_viewed",
        "customer",
        id,
        changes,
      );
    }

    return updated;
  }

  async search(query: string, type: string, user: SessionUser) {
    const scope = await this.scopeService.scopeByStore(
      user,
      customers.registeredAtStoreId,
    );

    if (type === "exact") {
      const conditions = [
        or(eq(customers.email, query), eq(customers.phone, query)),
        ...(scope ? [scope] : []),
      ];

      return this.db
        .select()
        .from(customers)
        .where(and(...conditions));
    }

    // type === "name" (default)
    const nameCondition = or(
      ilike(customers.firstName, `%${query}%`),
      ilike(customers.lastName, `%${query}%`),
    );

    const conditions = [nameCondition, ...(scope ? [scope] : [])];

    const rows = await this.db
      .select()
      .from(customers)
      .where(and(...conditions));

    const ranked = rankCustomerSearchResults({
      results: rows.map((r) => ({
        customerId: r.id,
        firstName: r.firstName,
        lastName: r.lastName,
        lastContactAt: r.lastContactAt,
        lastTransactionAt: r.lastTransactionAt,
        lastBaUserId: r.lastBaUserId,
        lifecycleSegment: r.lifecycleSegment as any,
        textMatchScore: 50, // base score for ilike matches
      })),
      searchingBaUserId: user.id,
    });

    return ranked;
  }

  async executeRightToBeForgotten(
    customerId: string,
    requestFolio: string,
    user: SessionUser,
  ) {
    const [customer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId));
    if (!customer) throw new NotFoundException("Customer not found");

    const anonymized = `ARCO-${requestFolio}`;

    await this.db.transaction(async (tx) => {
      // 1. Delete beauty profile shades (via beauty profile)
      const [profile] = await tx
        .select({ id: beautyProfiles.id })
        .from(beautyProfiles)
        .where(eq(beautyProfiles.customerId, customerId));

      if (profile) {
        await tx
          .delete(beautyProfileShades)
          .where(eq(beautyProfileShades.beautyProfileId, profile.id));
        await tx
          .delete(beautyProfiles)
          .where(eq(beautyProfiles.customerId, customerId));
      }

      // 2. Delete consents
      await tx.delete(consents).where(eq(consents.customerId, customerId));

      // 3. Anonymize purchases
      await tx
        .update(purchases)
        .set({ customerId: sql`null` } as any)
        .where(eq(purchases.customerId, customerId));

      // 4. Anonymize recommendations
      await tx
        .update(recommendations)
        .set({ customerId: sql`null` } as any)
        .where(eq(recommendations.customerId, customerId));

      // 5. Anonymize samples
      await tx
        .update(samples)
        .set({ customerId: sql`null` } as any)
        .where(eq(samples.customerId, customerId));

      // 6. Anonymize appointments
      await tx
        .update(appointments)
        .set({ customerId: sql`null` } as any)
        .where(eq(appointments.customerId, customerId));

      // 7. Anonymize communications
      await tx
        .update(communications)
        .set({ customerId: sql`null` } as any)
        .where(eq(communications.customerId, customerId));

      // 8. Hard delete customer
      await tx.delete(customers).where(eq(customers.id, customerId));
    });

    await this.auditService.log(
      user,
      "customer_deleted_arco_request",
      "customer",
      customerId,
      {
        requestFolio,
        customerName: `${customer.firstName} ${customer.lastName}`,
        anonymizedAs: anonymized,
      },
    );

    return { success: true, requestFolio };
  }
}
