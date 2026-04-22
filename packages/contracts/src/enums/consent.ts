export const ConsentType = {
  PRIVACY_NOTICE: "privacy_notice",
  MARKETING_SMS: "marketing_sms",
  MARKETING_EMAIL: "marketing_email",
  MARKETING_WHATSAPP: "marketing_whatsapp",
} as const;

export type ConsentType = (typeof ConsentType)[keyof typeof ConsentType];

export const CONSENT_TYPES = Object.values(ConsentType);
