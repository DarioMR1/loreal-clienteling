export interface CreateUser {
  email: string;
  fullName: string;
  role: string;
  storeId?: string;
  zoneId?: string;
  brandId?: string;
}

export type UpdateUser = Partial<Omit<CreateUser, "email">>;

export interface Login {
  email: string;
  password: string;
}
