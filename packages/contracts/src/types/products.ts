export interface CreateProduct {
  sku: string;
  name: string;
  brandId: string;
  category: string;
  subcategory?: string;
  description?: string;
  price: number;
  estimatedDurationDays?: number;
}

export type UpdateProduct = Partial<CreateProduct>;
