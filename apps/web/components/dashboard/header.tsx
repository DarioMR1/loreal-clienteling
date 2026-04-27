"use client";

import { useSidebar } from "@/components/dashboard/sidebar-context";

export function DashboardHeader() {
  const { setMobileOpen } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border/50 bg-background px-4 md:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="mr-3 flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground md:hidden"
        aria-label="Abrir menú"
      >
        <HamburgerIcon className="size-5" />
      </button>

      {/* Search bar — Zen: subtle input with soft focus ring */}
      <div className="relative w-full max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Buscar..."
          className="h-8 w-full rounded-xl border border-input bg-muted/30 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
    </header>
  );
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M2 4h12M2 8h12M2 12h12" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  );
}
