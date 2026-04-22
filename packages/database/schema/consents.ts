import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";

export const consents = pgTable(
  "consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 30 }).notNull(), // privacy_notice | marketing_sms | marketing_email | marketing_whatsapp
    version: varchar("version", { length: 20 }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    source: varchar("source", { length: 100 }).notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("consents_customer_idx").on(table.customerId),
    index("consents_type_idx").on(table.customerId, table.type),
  ],
);
