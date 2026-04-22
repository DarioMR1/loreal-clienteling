import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { stores } from "./stores";
import { users } from "./users";
import { products } from "./products";

export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id),
    purchasedAt: timestamp("purchased_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    posTransactionId: varchar("pos_transaction_id", { length: 100 }),
    source: varchar("source", { length: 20 }).notNull(), // pos_integration | manual | ecommerce
    attributedBaUserId: uuid("attributed_ba_user_id").references(
      () => users.id,
    ),
    attributionReason: varchar("attribution_reason", { length: 30 }), // last_consultation | active_recommendation | direct_assistance
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("purchases_customer_idx").on(table.customerId),
    index("purchases_store_idx").on(table.storeId),
  ],
);

export const purchaseItems = pgTable("purchase_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  purchaseId: uuid("purchase_id")
    .notNull()
    .references(() => purchases.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  sku: varchar("sku", { length: 100 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});
