export interface GrantConsent {
  customerId: string;
  type: string;
  version: string;
  source: string;
}

export interface RevokeConsent {
  customerId: string;
  type: string;
}
