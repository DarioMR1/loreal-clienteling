import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { users } from "./users";
import { stores } from "./stores";

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    baUserId: uuid("ba_user_id")
      .notNull()
      .references(() => users.id),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id),
    eventType: varchar("event_type", { length: 30 }).notNull(), // cabin_service | facial | anniversary_event | vip_cabin | product_followup | custom
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("scheduled"), // scheduled | confirmed | rescheduled | cancelled | completed | no_show
    comments: text("comments"),
    reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
    confirmationSentAt: timestamp("confirmation_sent_at", {
      withTimezone: true,
    }),
    isVirtual: boolean("is_virtual").notNull().default(false),
    videoLink: varchar("video_link", { length: 500 }),
    rescheduledFromAppointmentId: uuid("rescheduled_from_appointment_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("appointments_ba_idx").on(table.baUserId),
    index("appointments_store_idx").on(table.storeId),
    index("appointments_scheduled_idx").on(table.scheduledAt),
  ],
);
