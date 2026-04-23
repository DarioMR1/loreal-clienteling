import { getSession } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Hero section — Stripe-style onboarding prompt */}
      <section className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Bienvenido, {session?.user?.fullName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tus clientes, agenda citas y revisa el rendimiento de tu
          equipo desde un solo lugar.
        </p>
      </section>

      {/* Info cards grid — 3 columns like Stripe's quick-start cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="mb-1 flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <UsersSmIcon className="size-4 text-primary" />
            </div>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Consulta tu cartera de clientes y su historial de compras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-accent">
              Ver clientes →
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-1 flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <CalSmIcon className="size-4 text-primary" />
            </div>
            <CardTitle>Agenda</CardTitle>
            <CardDescription>
              Programa citas y seguimientos con tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-accent">
              Ver agenda →
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-1 flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <ChartSmIcon className="size-4 text-primary" />
            </div>
            <CardTitle>Reportes</CardTitle>
            <CardDescription>
              Analiza métricas de rendimiento y ventas del equipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-accent">
              Ver reportes →
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Account info card — like Stripe's API keys panel */}
      <Card>
        <CardHeader>
          <CardTitle>Tu cuenta</CardTitle>
          <CardDescription>
            Información de tu sesión actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="space-y-0.5">
              <dt className="text-muted-foreground">Correo</dt>
              <dd className="font-medium">{session?.user?.email}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-muted-foreground">Rol</dt>
              <dd className="font-medium">{session?.user?.role}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-muted-foreground">Tienda</dt>
              <dd className="font-medium">
                {session?.user?.storeId ?? "Sin asignar"}
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-muted-foreground">Marca</dt>
              <dd className="font-medium">
                {session?.user?.brandId ?? "Sin asignar"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Small inline icons for cards ─── */

function UsersSmIcon({ className }: { className?: string }) {
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
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1.5 14c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" />
      <circle cx="11.5" cy="5.5" r="1.5" />
      <path d="M11.5 9c1.5 0 3 1.2 3 3.5" />
    </svg>
  );
}

function CalSmIcon({ className }: { className?: string }) {
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
      <rect x="2" y="3" width="12" height="11" rx="1" />
      <path d="M5 1.5v2M11 1.5v2M2 7h12" />
    </svg>
  );
}

function ChartSmIcon({ className }: { className?: string }) {
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
      <path d="M2 14V8l3.5-2 3 4L12 4l2 2" />
    </svg>
  );
}
