import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, and } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { stores } from "@loreal/database";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";

@Injectable()
export class StoresService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    @Inject(ScopeService) private scopeService: ScopeService,
  ) {}

  async findAll(user: SessionUser) {
    const scope = await this.scopeService.scopeByStore(user, stores.id);
    if (scope) {
      return this.db.select().from(stores).where(scope);
    }
    return this.db.select().from(stores);
  }

  async findOne(id: string) {
    const [store] = await this.db
      .select()
      .from(stores)
      .where(eq(stores.id, id));
    if (!store) throw new NotFoundException("Store not found");
    return store;
  }

  async create(data: {
    code: string;
    displayName: string;
    chain: string;
    zoneId?: string;
    address?: string;
    city?: string;
    state?: string;
  }) {
    const [store] = await this.db.insert(stores).values(data).returning();
    return store;
  }

  async update(
    id: string,
    data: Partial<{
      code: string;
      displayName: string;
      chain: string;
      zoneId: string;
      address: string;
      city: string;
      state: string;
      active: boolean;
    }>,
  ) {
    const [store] = await this.db
      .update(stores)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(stores.id, id))
      .returning();
    if (!store) throw new NotFoundException("Store not found");
    return store;
  }
}
