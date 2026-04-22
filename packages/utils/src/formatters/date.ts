import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function formatDateMX(date: Date | string): string {
  return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}
