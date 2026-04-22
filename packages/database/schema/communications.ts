import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { users } from "./users";

export const communications = pgTable(
  "communications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    sentByUserId: uuid("sent_by_user_id")
      .notNull()
      .references(() => users.id),
    channel: varchar("channel", { length: 20 }).notNull(), // whatsapp | sms | email
    templateId: uuid("template_id"),
    subject: varchar("subject", { length: 200 }),
    body: text("body").notNull(),
    followupType: varchar("followup_type", { length: 30 }).notNull(), // 3_months | 6_months | birthday | replenishment | special_event | custom
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    trackingLinkId: uuid("tracking_link_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("communications_customer_idx").on(table.customerId),
  ],
);
