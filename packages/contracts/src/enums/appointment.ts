export const AppointmentStatus = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  RESCHEDULED: "rescheduled",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  NO_SHOW: "no_show",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const APPOINTMENT_STATUSES = Object.values(AppointmentStatus);

export const AppointmentEventType = {
  CABIN_SERVICE: "cabin_service",
  FACIAL: "facial",
  ANNIVERSARY_EVENT: "anniversary_event",
  VIP_CABIN: "vip_cabin",
  PRODUCT_FOLLOWUP: "product_followup",
  CUSTOM: "custom",
} as const;

export type AppointmentEventType =
  (typeof AppointmentEventType)[keyof typeof AppointmentEventType];

export const APPOINTMENT_EVENT_TYPES = Object.values(AppointmentEventType);
