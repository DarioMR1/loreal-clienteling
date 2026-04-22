import {
  pgTable,
  uuid,
  text,
  varchar,
  date,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { users } from "./auth";

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 320 }).unique(),
    phone: varchar("phone", { length: 20 }).unique(),
    gender: varchar("gender", { length: 20 }), // female | male | non_binary | prefer_not_say
    birthDate: date("birth_date"),
    registeredAtStoreId: uuid("registered_at_store_id")
      .notNull()
      .references(() => stores.id),
    registeredByUserId: text("registered_by_user_id")
      .notNull()
      .references(() => users.id),
    lastBaUserId: text("last_ba_user_id").references(() => users.id),
    customerSince: timestamp("customer_since", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastContactAt: timestamp("last_contact_at", { withTimezone: true }),
    lastTransactionAt: timestamp("last_transaction_at", { withTimezone: true }),
    lifecycleSegment: varchar("lifecycle_segment", { length: 20 })
      .notNull()
      .default("new"), // new | returning | vip | at_risk
    inactive: boolean("inactive").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("customers_store_idx").on(table.registeredAtStoreId),
    index("customers_name_idx").on(table.firstName, table.lastName),
    index("customers_segment_idx").on(table.lifecycleSegment),
  ],
);
