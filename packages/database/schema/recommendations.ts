import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { products } from "./products";
import { users } from "./users";
import { stores } from "./stores";

export const recommendations = pgTable(
  "recommendations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    baUserId: uuid("ba_user_id")
      .notNull()
      .references(() => users.id),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id),
    recommendedAt: timestamp("recommended_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    source: varchar("source", { length: 30 }).notNull(), // manual | ai_suggested | replenishment_alert
    aiReasoning: text("ai_reasoning"),
    notes: text("notes"),
    visitReason: varchar("visit_reason", { length: 30 }), // new_purchase | rebuy | gift | concern | promotion | browsing
    convertedToPurchase: boolean("converted_to_purchase")
      .notNull()
      .default(false),
    conversionPurchaseId: uuid("conversion_purchase_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("recommendations_customer_idx").on(table.customerId),
    index("recommendations_store_idx").on(table.storeId),
  ],
);
