"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer, useDeleteCustomerArco } from "@/lib/hooks";
import { can } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileSection } from "./profile-section";
import { BeautySection } from "./beauty-section";
import { PurchasesSection } from "./purchases-section";
import { RecommendationsSection } from "./recommendations-section";
import { AppointmentsSection } from "./appointments-section";
import { CommunicationsSection } from "./communications-section";
import { ConsentsSection } from "./consents-section";

// ── Label maps ─────────────────────────────────────────────────────

const SEGMENT_LABEL: Record<string, string> = {
  new: "Nueva",
  returning: "Recurrente",
  vip: "VIP",
  at_risk: "En riesgo",
};

const SEGMENT_VARIANT: Record<string, "default" | "info" | "success" | "warning"> = {
  new: "info",
  returning: "default",
  vip: "success",
  at_risk: "warning",
};

// ── Tabs ───────────────────────────────────────────────────────────

const TABS = [
  { key: "perfil", label: "Perfil" },
  { key: "belleza", label: "Belleza" },
  { key: "compras", label: "Compras" },
  { key: "recomendaciones", label: "Recomendaciones" },
  { key: "citas", label: "Citas" },
  { key: "seguimiento", label: "Seguimiento" },
  { key: "consentimientos", label: "Consentimientos" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ── Component ──────────────────────────────────────────────────────

interface CustomerDetailPageProps {
  customerId: string;
  user: { role?: string | null };
}

export function CustomerDetailPage({
  customerId,
  user,
}: CustomerDetailPageProps) {
  const role = user.role ?? "ba";
  const router = useRouter();
  const { data: customer, isLoading } = useCustomer(customerId);
  const [activeTab, setActiveTab] = useState<TabKey>("perfil");
  const [showArco, setShowArco] = useState(false);
  const deleteArco = useDeleteCustomerArco();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Link
          href="/clientes"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Volver a clientes
        </Link>
        <p className="text-sm text-muted-foreground">Cliente no encontrado.</p>
      </div>
    );
  }

  const seg = customer.lifecycleSegment;

  function handleArcoDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const folio = formData.get("requestFolio") as string;
    deleteArco.mutate(
      { id: customerId, requestFolio: folio },
      {
        onSuccess: () => {
          setShowArco(false);
          router.push("/clientes");
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back link */}
      <Link
        href="/clientes"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Clientes
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {customer.firstName} {customer.lastName}
            </h1>
            <Badge variant={SEGMENT_VARIANT[seg] ?? "secondary"} size="sm">
              {SEGMENT_LABEL[seg] ?? seg}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Clienta desde{" "}
            {new Date(customer.customerSince).toLocaleDateString("es-MX", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {can(role, "customer.delete") && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowArco(true)}
          >
            Derecho ARCO
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "perfil" && (
        <ProfileSection customer={customer} role={role} />
      )}
      {activeTab === "belleza" && (
        <BeautySection customerId={customerId} role={role} />
      )}
      {activeTab === "compras" && (
        <PurchasesSection customerId={customerId} />
      )}
      {activeTab === "recomendaciones" && (
        <RecommendationsSection customerId={customerId} />
      )}
      {activeTab === "citas" && (
        <AppointmentsSection customerId={customerId} />
      )}
      {activeTab === "seguimiento" && (
        <CommunicationsSection customerId={customerId} />
      )}
      {activeTab === "consentimientos" && (
        <ConsentsSection customerId={customerId} role={role} />
      )}

      {/* ARCO Dialog */}
      <Dialog open={showArco} onOpenChange={(open) => !open && setShowArco(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Derecho al olvido (ARCO)</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="mb-4 text-sm text-muted-foreground">
              Esta acción eliminará permanentemente todos los datos personales de{" "}
              <strong>
                {customer.firstName} {customer.lastName}
              </strong>
              . Las métricas agregadas se preservarán de forma anónima. Esta
              acción no se puede deshacer.
            </p>
            <form id="arco-form" onSubmit={handleArcoDelete} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requestFolio">Folio de solicitud</Label>
                <Input
                  id="requestFolio"
                  name="requestFolio"
                  placeholder="ARCO-2026-0001"
                  required
                  disabled={deleteArco.isPending}
                />
              </div>
            </form>
          </DialogBody>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" disabled={deleteArco.isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="arco-form"
              variant="destructive"
              disabled={deleteArco.isPending}
            >
              {deleteArco.isPending ? "Eliminando..." : "Eliminar datos"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
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
      <path d="M10 3L5 8l5 5" />
    </svg>
  );
}
