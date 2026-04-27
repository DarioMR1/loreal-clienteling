export interface PurchaseItem {
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchase {
  customerId: string;
  source: string;
  items: PurchaseItem[];
  totalAmount: number;
  posTransactionId?: string;
}
