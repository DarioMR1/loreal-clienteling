export interface CreateCustomer {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthDate?: Date;
}

export type UpdateCustomer = Partial<CreateCustomer>;

export interface SearchCustomer {
  query: string;
  type?: "exact" | "name" | "semantic";
}

export interface CustomerFilters {
  segment?: string;
  storeId?: string;
  brandId?: string;
}
