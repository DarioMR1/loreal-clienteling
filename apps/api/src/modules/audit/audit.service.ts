import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { auditLogs } from "@loreal/database";

@Injectable()
export class AuditQueryService {
  constructor(@Inject(DATABASE_TOKEN) private db: Database) {}

  async findAll(filters: {
    page: number;
    limit: number;
    action?: string;
    entityType?: string;
    actorUserId?: string;
    from?: Date;
    to?: Date;
  }) {
    const conditions: any[] = [];
    if (filters.action) conditions.push(eq(auditLogs.action, filters.action));
    if (filters.entityType) conditions.push(eq(auditLogs.entityType, filters.entityType));
    if (filters.actorUserId) conditions.push(eq(auditLogs.actorUserId, filters.actorUserId));
    if (filters.from) conditions.push(gte(auditLogs.timestamp, filters.from));
    if (filters.to) conditions.push(lte(auditLogs.timestamp, filters.to));

    return this.db
      .select()
      .from(auditLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(auditLogs.timestamp))
      .limit(filters.limit)
      .offset((filters.page - 1) * filters.limit);
  }

  async findOne(id: string) {
    const [log] = await this.db.select().from(auditLogs).where(eq(auditLogs.id, id));
    if (!log) throw new NotFoundException("Audit log not found");
    return log;
  }
}
