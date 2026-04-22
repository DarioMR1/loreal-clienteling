import { z } from "zod";
import { PURCHASE_SOURCES } from "../enums/purchase";

export const purchaseItemSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

export type PurchaseItem = z.infer<typeof purchaseItemSchema>;

export const createPurchaseSchema = z.object({
  customerId: z.string().uuid(),
  source: z.enum(PURCHASE_SOURCES as [string, ...string[]]),
  items: z.array(purchaseItemSchema).min(1),
  totalAmount: z.number().positive(),
  posTransactionId: z.string().optional(),
});

export type CreatePurchase = z.infer<typeof createPurchaseSchema>;
