import {
  pgTable,
  uuid,
  text,
  varchar,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { brands } from "./brands";
import { users } from "./auth";

export const beautyProfiles = pgTable("beauty_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .notNull()
    .unique()
    .references(() => customers.id, { onDelete: "cascade" }),
  skinType: varchar("skin_type", { length: 20 }), // dry | oily | combination | sensitive | normal
  skinTone: varchar("skin_tone", { length: 20 }), // fair | light | medium | tan | deep
  skinSubtone: varchar("skin_subtone", { length: 20 }), // cool | neutral | warm
  skinConcerns: jsonb("skin_concerns").$type<string[]>(),
  preferredIngredients: jsonb("preferred_ingredients").$type<string[]>(),
  avoidedIngredients: jsonb("avoided_ingredients").$type<string[]>(),
  fragrancePreferences: jsonb("fragrance_preferences").$type<string[]>(),
  makeupPreferences: jsonb("makeup_preferences"),
  routineType: varchar("routine_type", { length: 20 }), // morning | night | both
  interests: jsonb("interests").$type<string[]>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const beautyProfileShades = pgTable("beauty_profile_shades", {
  id: uuid("id").primaryKey().defaultRandom(),
  beautyProfileId: uuid("beauty_profile_id")
    .notNull()
    .references(() => beautyProfiles.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 20 }).notNull(), // foundation | concealer | lipstick | blush
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id),
  productId: uuid("product_id").notNull(), // FK added in products.ts to avoid circular
  shadeCode: varchar("shade_code", { length: 50 }).notNull(),
  capturedAt: timestamp("captured_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  capturedByUserId: text("captured_by_user_id")
    .notNull()
    .references(() => users.id),
});
