export interface CreateTemplate {
  name: string;
  brandId?: string;
  channel: string;
  followupType: string;
  body: string;
}

export type UpdateTemplate = Partial<CreateTemplate>;
