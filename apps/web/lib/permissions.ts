import type { UserRole } from "@loreal/contracts";

// ── Permission definitions ─────────────────────────────────────────
// Each key is a permission, value is the list of roles that have it.
// Add new permissions here — they propagate to `can()`, sidebar, and UI.

const PERMISSIONS = {
  // Brands
  "brand.create": ["admin"],
  "brand.edit": ["admin"],

  // Zones
  "zone.create": ["admin"],
  "zone.edit": ["admin"],

  // Stores
  "store.create": ["admin"],
  "store.edit": ["admin"],

  // Products
  "product.create": ["admin"],
  "product.edit": ["admin"],
  "product.availability": ["admin", "manager"],

  // Users
  "user.manage": ["admin"],
  "user.view": ["manager", "admin"],

  // Customers
  "customer.create": ["ba", "manager"],
  "customer.edit": ["ba", "manager"],
  "customer.delete": ["admin"], // ARCO right to be forgotten

  // Appointments
  "appointment.create": ["ba", "manager"],
  "appointment.edit": ["ba", "manager", "admin"],

  // Communications
  "communication.create": ["ba", "manager"],
  "template.manage": ["admin", "manager"],

  // Analytics
  "analytics.view": ["manager", "supervisor", "admin"],

  // Audit
  "audit.view": ["admin"],
} as const satisfies Record<string, readonly UserRole[]>;

export type Permission = keyof typeof PERMISSIONS;

// ── Helper ─────────────────────────────────────────────────────────

/**
 * Check if a user's role has a specific permission.
 *
 * Usage:
 *   {can(user.role, "brand.create") && <Button>Nueva marca</Button>}
 */
export function can(role: string | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}
