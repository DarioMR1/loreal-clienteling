import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { brands } from "./brands";
import { stores } from "./stores";
import { zones } from "./zones";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  passwordHash: varchar("password_hash", { length: 500 }),
  role: varchar("role", { length: 20 }).notNull(), // ba | manager | supervisor | admin
  storeId: uuid("store_id").references(() => stores.id),
  zoneId: uuid("zone_id").references(() => zones.id),
  brandId: uuid("brand_id").references(() => brands.id),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
