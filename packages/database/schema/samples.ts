import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { products } from "./products";
import { users } from "./auth";
import { stores } from "./stores";

export const samples = pgTable("samples", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  baUserId: text("ba_user_id")
    .notNull()
    .references(() => users.id),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  deliveredAt: timestamp("delivered_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  convertedToPurchase: boolean("converted_to_purchase")
    .notNull()
    .default(false),
  conversionPurchaseId: uuid("conversion_purchase_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
