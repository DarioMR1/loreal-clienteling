import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { brands } from "./brands";

export const appointmentEventTypes = pgTable("appointment_event_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 30 }).notNull().unique(),
  displayName: varchar("display_name", { length: 200 }).notNull(),
  durationMinutes: integer("duration_minutes").default(60),
  color: varchar("color", { length: 20 }),
  description: text("description"),
  brandId: uuid("brand_id").references(() => brands.id),
  maxCapacity: integer("max_capacity").default(1),
  requiresConfirmation: boolean("requires_confirmation")
    .notNull()
    .default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
