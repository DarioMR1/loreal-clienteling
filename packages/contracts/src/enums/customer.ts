export const Gender = {
  FEMALE: "female",
  MALE: "male",
  NON_BINARY: "non_binary",
  PREFER_NOT_SAY: "prefer_not_say",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const GENDERS = Object.values(Gender);

export const LifecycleSegment = {
  NEW: "new",
  RETURNING: "returning",
  VIP: "vip",
  AT_RISK: "at_risk",
} as const;

export type LifecycleSegment =
  (typeof LifecycleSegment)[keyof typeof LifecycleSegment];

export const LIFECYCLE_SEGMENTS = Object.values(LifecycleSegment);
