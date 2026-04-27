export interface CreateZone {
  code: string;
  displayName: string;
  region?: string;
}

export type UpdateZone = Partial<CreateZone>;
