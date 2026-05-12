import { Injectable, Inject, NotFoundException, ForbiddenException } from "@nestjs/common";
import { eq, and, sql, count, ilike } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { users, stores, zones, brands } from "@loreal/database";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";
import { AuditService } from "../../common/services/audit.service";

interface UserFilters {
  role?: string;
  storeId?: string;
  zoneId?: string;
  brandId?: string;
  active?: boolean;
  invitationStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface InviteUserData {
  email: string;
  fullName: string;
  role: string;
  storeId?: string;
  zoneId?: string;
  brandId?: string;
}

interface UpdateUserData {
  role?: string;
  storeId?: string | null;
  zoneId?: string | null;
  brandId?: string | null;
  active?: boolean;
  fullName?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    @Inject(ScopeService) private scopeService: ScopeService,
    @Inject(AuditService) private auditService: AuditService,
  ) {}

  async findAll(user: SessionUser, filters: UserFilters = {}) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 50;
    const offset = (page - 1) * limit;

    const conditions: any[] = [];

    // Role-based scoping
    if (user.role === "manager") {
      // Manager sees BAs in their store
      if (user.storeId) {
        conditions.push(eq(users.storeId, user.storeId));
      }
    } else if (user.role === "supervisor") {
      // Supervisor sees users in their zone
      const storeIds = await this.scopeService.getAccessibleStoreIds(user);
      if (storeIds.length > 0) {
        conditions.push(
          sql`${users.storeId} IN (${sql.join(storeIds.map((id) => sql`${id}`), sql`, `)})`,
        );
      }
    }
    // Admin sees all

    // Apply filters
    if (filters.role) conditions.push(eq(users.role, filters.role));
    if (filters.storeId) conditions.push(eq(users.storeId, filters.storeId));
    if (filters.zoneId) conditions.push(eq(users.zoneId, filters.zoneId));
    if (filters.brandId) conditions.push(eq(users.brandId, filters.brandId));
    if (filters.active !== undefined) conditions.push(eq(users.active, filters.active));
    if (filters.invitationStatus) conditions.push(eq(users.invitationStatus, filters.invitationStatus));
    if (filters.search) {
      conditions.push(
        sql`(${users.fullName} ILIKE ${`%${filters.search}%`} OR ${users.email} ILIKE ${`%${filters.search}%`})`,
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await this.db
      .select({ count: count() })
      .from(users)
      .where(where);

    const rows = await this.db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        storeId: users.storeId,
        storeName: stores.displayName,
        zoneId: users.zoneId,
        zoneName: zones.displayName,
        brandId: users.brandId,
        brandName: brands.displayName,
        active: users.active,
        invitationStatus: users.invitationStatus,
        invitedAt: users.invitedAt,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .leftJoin(stores, sql`${users.storeId}::uuid = ${stores.id}`)
      .leftJoin(zones, sql`${users.zoneId}::uuid = ${zones.id}`)
      .leftJoin(brands, sql`${users.brandId}::uuid = ${brands.id}`)
      .where(where)
      .orderBy(users.fullName)
      .limit(limit)
      .offset(offset);

    return {
      data: rows,
      total: totalResult?.count ?? 0,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const [row] = await this.db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        storeId: users.storeId,
        storeName: stores.displayName,
        zoneId: users.zoneId,
        zoneName: zones.displayName,
        brandId: users.brandId,
        brandName: brands.displayName,
        active: users.active,
        invitationStatus: users.invitationStatus,
        invitedAt: users.invitedAt,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .leftJoin(stores, sql`${users.storeId}::uuid = ${stores.id}`)
      .leftJoin(zones, sql`${users.zoneId}::uuid = ${zones.id}`)
      .leftJoin(brands, sql`${users.brandId}::uuid = ${brands.id}`)
      .where(eq(users.id, id));

    if (!row) throw new NotFoundException("User not found");
    return row;
  }

  async invite(data: InviteUserData, invitedBy: SessionUser) {
    const id = crypto.randomUUID();

    await this.db.insert(users).values({
      id,
      name: data.fullName,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      storeId: data.storeId ?? null,
      zoneId: data.zoneId ?? null,
      brandId: data.brandId ?? null,
      emailVerified: false,
      active: true,
      invitationStatus: "pending",
      invitedAt: new Date(),
      invitedByUserId: invitedBy.id,
    });

    await this.auditService.log(
      invitedBy,
      "user_invited",
      "user",
      id,
      { email: data.email, role: data.role },
    );

    return this.findOne(id);
  }

  async update(id: string, data: UpdateUserData, updatedBy: SessionUser) {
    const existing = await this.findOne(id);

    const updateValues: Record<string, any> = {};
    if (data.role !== undefined) updateValues.role = data.role;
    if (data.storeId !== undefined) updateValues.storeId = data.storeId;
    if (data.zoneId !== undefined) updateValues.zoneId = data.zoneId;
    if (data.brandId !== undefined) updateValues.brandId = data.brandId;
    if (data.active !== undefined) updateValues.active = data.active;
    if (data.fullName !== undefined) {
      updateValues.fullName = data.fullName;
      updateValues.name = data.fullName;
    }

    if (Object.keys(updateValues).length === 0) return existing;

    await this.db.update(users).set(updateValues).where(eq(users.id, id));

    await this.auditService.log(
      updatedBy,
      "user_updated",
      "user",
      id,
      updateValues,
    );

    return this.findOne(id);
  }
}
