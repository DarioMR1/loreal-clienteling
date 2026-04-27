export interface CreateCommunication {
  customerId: string;
  channel: string;
  templateId?: string;
  subject?: string;
  body: string;
  followupType: string;
}
