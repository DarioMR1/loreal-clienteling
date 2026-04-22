export const CommunicationChannel = {
  WHATSAPP: "whatsapp",
  SMS: "sms",
  EMAIL: "email",
} as const;

export type CommunicationChannel =
  (typeof CommunicationChannel)[keyof typeof CommunicationChannel];

export const COMMUNICATION_CHANNELS = Object.values(CommunicationChannel);

export const FollowupType = {
  THREE_MONTHS: "3_months",
  SIX_MONTHS: "6_months",
  BIRTHDAY: "birthday",
  REPLENISHMENT: "replenishment",
  SPECIAL_EVENT: "special_event",
  CUSTOM: "custom",
} as const;

export type FollowupType = (typeof FollowupType)[keyof typeof FollowupType];

export const FOLLOWUP_TYPES = Object.values(FollowupType);
