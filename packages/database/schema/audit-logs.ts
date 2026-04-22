import {
  pgTable,
  uuid,
  text,
  varchar,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: text("actor_user_id"), // null = system action; text to match Better Auth users.id
    action: varchar("action", { length: 50 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: varchar("entity_id", { length: 100 }).notNull(),
    changes: jsonb("changes"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 500 }),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_logs_actor_idx").on(table.actorUserId),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_timestamp_idx").on(table.timestamp),
  ],
);
