import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* ── Branded Panel (left) — Zen asymmetry: 45/55 split ── */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        {/* Subtle texture overlay — washi paper grain */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />

        {/* Decorative gold accent line — Zen: single deliberate stroke */}
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

        {/* Top: Logo & brand mark */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
              <span className="text-sm font-bold text-accent-foreground">
                L
              </span>
            </div>
            <div>
              <p className="text-sm font-medium tracking-wide text-primary-foreground">
                L&apos;Oréal
              </p>
              <p className="text-xs tracking-widest text-primary-foreground/50 uppercase">
                Clienteling
              </p>
            </div>
          </div>
        </div>

        {/* Center: Zen-inspired typographic composition — Ma (breathing room) */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="h-px w-12 bg-accent/40" />
            <blockquote className="text-xl leading-relaxed font-light tracking-wide text-primary-foreground/90">
              La belleza comienza en el momento en que decides ser tú misma.
            </blockquote>
            <p className="text-xs tracking-widest text-accent uppercase">
              — Coco Chanel
            </p>
          </div>
        </div>

        {/* Bottom: Subtle footer */}
        <div className="relative z-10">
          <p className="text-xs text-primary-foreground/30">
            Plataforma de gestión de relaciones con clientas
          </p>
        </div>
      </div>

      {/* ── Form Panel (right) — generous Ma spacing ── */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header — visible only on small screens */}
        <div className="flex items-center gap-3 border-b border-border/50 p-6 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">L</span>
          </div>
          <div>
            <p className="text-sm font-medium">L&apos;Oréal Clienteling</p>
          </div>
        </div>

        {/* Form container — centered with breathing room */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-6 border-t border-border/50 px-6 py-4">
          <Link
            href="#"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Soporte
          </Link>
          <span className="text-xs text-border">·</span>
          <Link
            href="#"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacidad
          </Link>
          <span className="text-xs text-border">·</span>
          <Link
            href="#"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Términos
          </Link>
        </div>
      </div>
    </div>
  );
}
