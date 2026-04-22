import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { zones } from "@loreal/database";
import type { SessionUser } from "../../common/types/session";

@Injectable()
export class ZonesService {
  constructor(@Inject(DATABASE_TOKEN) private db: Database) {}

  async findAll(user: SessionUser) {
    if (user.role === "supervisor" && user.zoneId) {
      return this.db.select().from(zones).where(eq(zones.id, user.zoneId));
    }
    return this.db.select().from(zones);
  }

  async findOne(id: string) {
    const [zone] = await this.db
      .select()
      .from(zones)
      .where(eq(zones.id, id));
    if (!zone) throw new NotFoundException("Zone not found");
    return zone;
  }

  async create(data: { code: string; displayName: string; region?: string }) {
    const [zone] = await this.db.insert(zones).values(data).returning();
    return zone;
  }

  async update(id: string, data: Partial<{ code: string; displayName: string; region: string }>) {
    const [zone] = await this.db
      .update(zones)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(zones.id, id))
      .returning();
    if (!zone) throw new NotFoundException("Zone not found");
    return zone;
  }
}
