"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@loreal/contracts";

// ── Types ──────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: readonly UserRole[];
}

interface NavSection {
  label?: string;
  items: readonly NavItem[];
}

interface SidebarProps {
  user: {
    fullName?: string | null;
    role?: string | null;
  };
}

// ── Navigation config ──────────────────────────────────────────────
// Single source of truth. Each item declares which roles can see it.

const NAV_SECTIONS: readonly NavSection[] = [
  {
    items: [
      { label: "Inicio", href: "/", icon: HomeIcon, roles: ["ba", "manager", "supervisor", "admin"] },
      { label: "Clientes", href: "/clientes", icon: UsersIcon, roles: ["ba", "manager", "supervisor", "admin"] },
      { label: "Agenda", href: "/agenda", icon: CalendarIcon, roles: ["ba", "manager", "supervisor", "admin"] },
    ],
  },
  {
    label: "Gestión",
    items: [
      { label: "Productos", href: "/productos", icon: BoxIcon, roles: ["ba", "manager", "supervisor", "admin"] },
      { label: "Reportes", href: "/reportes", icon: ChartIcon, roles: ["manager", "supervisor", "admin"] },
      { label: "Seguimiento", href: "/seguimiento", icon: MegaphoneIcon, roles: ["ba", "manager", "admin"] },
    ],
  },
  {
    label: "Configuración",
    items: [
      { label: "Marcas", href: "/marcas", icon: TagIcon, roles: ["admin"] },
      { label: "Tiendas", href: "/tiendas", icon: StoreIcon, roles: ["admin", "supervisor"] },
      { label: "Zonas", href: "/zonas", icon: MapIcon, roles: ["admin", "supervisor"] },
      { label: "Equipo", href: "/equipo", icon: TeamIcon, roles: ["manager", "admin"] },
      { label: "Plantillas", href: "/plantillas", icon: FileTextIcon, roles: ["admin"] },
      { label: "Auditoría", href: "/auditoria", icon: ShieldIcon, roles: ["admin"] },
    ],
  },
];

// ── Role labels for display ────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  ba: "Beauty Advisor",
  manager: "Gerente",
  supervisor: "Supervisor",
  admin: "Administrador",
};

// ── Component ──────────────────────────────────────────────────────

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const role = user.role ?? "ba";

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-sidebar-accent">
          <span className="text-xs font-bold text-sidebar-accent-foreground">
            L
          </span>
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
          L&apos;Oréal Clienteling
        </span>
      </div>

      {/* Navigation — filtered by role */}
      <nav className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-3">
        {NAV_SECTIONS.map((section, i) => {
          const visibleItems = section.items.filter((item) =>
            item.roles.includes(role as UserRole),
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={i}>
              {section.label && (
                <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
                  {section.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon className="size-4 shrink-0 opacity-70" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-sidebar-foreground/70">
          <div className="flex size-7 items-center justify-center rounded-full bg-sidebar-accent text-[11px] font-semibold text-sidebar-accent-foreground">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sidebar-foreground">
              {user.fullName}
            </span>
            <span className="text-[11px] text-sidebar-foreground/50">
              {ROLE_LABELS[role] ?? role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Inline SVG icons (Stripe-style: 16px, stroke-based) ─── */

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6.5L8 2l6 4.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6.5z" />
      <path d="M6 14V9h4v5" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1.5 14c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" />
      <circle cx="11.5" cy="5.5" r="1.5" />
      <path d="M11.5 9c1.5 0 3 1.2 3 3.5" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="11" rx="1" />
      <path d="M5 1.5v2M11 1.5v2M2 7h12" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5l6-3 6 3-6 3-6-3z" />
      <path d="M2 5v6l6 3V8" />
      <path d="M14 5v6l-6 3V8" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14V8l3.5-2 3 4L12 4l2 2" />
    </svg>
  );
}

function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3v8l-7-2V5l7-2z" />
      <path d="M6 5v6l-2 2.5V7.5" />
      <circle cx="14" cy="7" r="0.5" fill="currentColor" />
    </svg>
  );
}

function StoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l1-4h10l1 4" />
      <path d="M2 6c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2" />
      <path d="M2 8v6h12V8" />
      <path d="M6 14v-4h4v4" />
    </svg>
  );
}

function TeamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="4.5" r="2.5" />
      <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2h5.5l6.5 6.5-5.5 5.5L2 7.5V2z" />
      <circle cx="5.5" cy="5.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3.5l4.5-1.5 5 2 4.5-1.5v11l-4.5 1.5-5-2L1 14.5z" />
      <path d="M5.5 2v11M10.5 4v11" />
    </svg>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5l-4-4z" />
      <path d="M9 1v4h4" />
      <path d="M5.5 8.5h5M5.5 11h3" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5L2.5 4v4c0 3.5 2.5 5.5 5.5 6.5 3-1 5.5-3 5.5-6.5V4L8 1.5z" />
      <path d="M6 8l1.5 1.5L10 6.5" />
    </svg>
  );
}
