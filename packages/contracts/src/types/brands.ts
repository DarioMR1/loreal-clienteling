export interface CreateBrand {
  code: string;
  displayName: string;
  tier: string;
}

export type UpdateBrand = Partial<CreateBrand>;
