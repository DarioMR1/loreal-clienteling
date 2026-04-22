import { Injectable, Inject } from "@nestjs/common";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { auditLogs } from "@loreal/database";
import type { SessionUser } from "../types/session";

@Injectable()
export class AuditService {
  constructor(@Inject(DATABASE_TOKEN) private db: Database) {}

  async log(
    actor: SessionUser | null,
    action: string,
    entityType: string,
    entityId: string,
    changes?: Record<string, unknown>,
    meta?: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
    await this.db.insert(auditLogs).values({
      actorUserId: actor?.id ?? null,
      action,
      entityType,
      entityId,
      changes: changes ?? null,
      ipAddress: meta?.ipAddress ?? null,
      userAgent: meta?.userAgent ?? null,
    });
  }
}
