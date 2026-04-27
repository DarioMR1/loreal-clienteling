export interface CreateStore {
  code: string;
  displayName: string;
  chain: string;
  zoneId?: string;
  address?: string;
  city?: string;
  state?: string;
}

export type UpdateStore = Partial<CreateStore>;
