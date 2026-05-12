/**
 * Centralized color/label/icon maps for appointments, activity feed,
 * and status badges. Single source of truth — imported by all screens
 * that display event types or statuses.
 */
import type { IconName } from "@/components/ui/icon";

// ─── Appointment Event Types ─────────────────────────────

export const eventTypeLabels: Record<string, string> = {
  cabin_service: "Servicio de cabina",
  facial: "Facial",
  anniversary_event: "Evento aniversario",
  vip_cabin: "Cabina VIP",
  product_followup: "Seguimiento de producto",
  custom: "Personalizado",
};

export const eventTypeColors: Record<string, string> = {
  cabin_service: "#C9A96E",
  facial: "#5B7FA5",
  anniversary_event: "#7B1FA2",
  vip_cabin: "#C9A96E",
  product_followup: "#4A7C59",
  custom: "#6B6B6B",
};

export const eventTypeIcons: Record<string, IconName> = {
  facial: "sparkles",
  cabin_service: "star",
  anniversary_event: "ribbon",
  vip_cabin: "star",
  product_followup: "clipboard",
  custom: "calendar",
};

// ─── Appointment Status ──────────────────────────────────

export const statusLabels: Record<string, string> = {
  scheduled: "Programada",
  confirmed: "Confirmada",
  rescheduled: "Reagendada",
  cancelled: "Cancelada",
  completed: "Completada",
  no_show: "No asistió",
};

export const statusColors: Record<string, string> = {
  scheduled: "#5B7FA5",
  confirmed: "#4A7C59",
  rescheduled: "#D4A017",
  cancelled: "#C44536",
  completed: "#5B7FA5",
  no_show: "#C44536",
};

// ─── Activity Feed ───────────────────────────────────────

export const activityIcons: Record<string, IconName> = {
  purchase: "bag",
  recommendation: "sparkles",
  communication: "chatbubble",
  sample: "gift",
};

export const activityColors: Record<string, string> = {
  purchase: "#4A7C59",
  recommendation: "#C9A96E",
  communication: "#5B7FA5",
  sample: "#D4A017",
};

// ─── Follow-up Types ─────────────────────────────────────

export const followUpLabels: Record<string, string> = {
  "3_months": "3 meses",
  "6_months": "6 meses",
  birthday: "Cumpleaños",
  replenishment: "Reposición",
  special_event: "Evento especial",
  custom: "Personalizado",
};
