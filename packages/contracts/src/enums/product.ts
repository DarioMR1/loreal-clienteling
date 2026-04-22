export const ProductCategory = {
  SKINCARE: "skincare",
  MAKEUP: "makeup",
  FRAGRANCE: "fragrance",
} as const;

export type ProductCategory =
  (typeof ProductCategory)[keyof typeof ProductCategory];

export const PRODUCT_CATEGORIES = Object.values(ProductCategory);

export const StockStatus = {
  AVAILABLE: "available",
  LOW: "low",
  OUT_OF_STOCK: "out_of_stock",
} as const;

export type StockStatus = (typeof StockStatus)[keyof typeof StockStatus];

export const STOCK_STATUSES = Object.values(StockStatus);
