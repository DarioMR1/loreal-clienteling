"use client";

import { useState } from "react";
import { useStores, useCreateStore, useUpdateStore, useZones, type Store } from "@/lib/hooks";
import { can } from "@/lib/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { StoreForm, type StoreFormData } from "./store-form";

type DialogState = null | { mode: "create" } | { mode: "edit"; store: Store };

const CHAIN_LABEL: Record<string, string> = {
  liverpool: "Liverpool",
  palacio: "Palacio de Hierro",
  owned: "Boutique propia",
};

interface StoresPageProps {
  user: { role?: string | null };
}

export function StoresPage({ user }: StoresPageProps) {
  const role = user.role ?? "ba";
  const { data: stores = [], isLoading } = useStores();
  const { data: zones = [] } = useZones();
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const [dialog, setDialog] = useState<DialogState>(null);

  const zoneMap = Object.fromEntries(zones.map((z) => [z.id, z.displayName]));

  const columns: Column<Store>[] = [
    { key: "code", label: "Código" },
    { key: "displayName", label: "Nombre" },
    {
      key: "chain",
      label: "Cadena",
      render: (v) => (
        <Badge variant="secondary">{CHAIN_LABEL[v as string] ?? (v as string)}</Badge>
      ),
    },
    {
      key: "zoneId",
      label: "Zona",
      render: (v) => zoneMap[v as string] ?? "—",
    },
    { key: "city", label: "Ciudad", render: (v) => (v as string) ?? "—" },
    {
      key: "active",
      label: "Estado",
      render: (v) => (
        <Badge variant={v ? "success" : "destructive"} size="sm">
          {v ? "Activa" : "Inactiva"}
        </Badge>
      ),
    },
    ...(can(role, "store.edit")
      ? [{
          key: "actions" as const,
          label: "",
          className: "w-10",
          render: (_: unknown, row: Store) => (
            <Button variant="ghost" size="icon-xs" onClick={() => setDialog({ mode: "edit", store: row })}>
              <EditIcon className="size-3.5" />
            </Button>
          ),
        }]
      : []),
  ];

  function handleSubmit(data: StoreFormData) {
    if (dialog?.mode === "edit") {
      updateStore.mutate({ id: dialog.store.id, ...data }, { onSuccess: () => setDialog(null) });
    } else {
      createStore.mutate(data, { onSuccess: () => setDialog(null) });
    }
  }

  const isPending = createStore.isPending || updateStore.isPending;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Tiendas"
        description="Puntos de venta físicos del portafolio"
        action={
          can(role, "store.create") ? (
            <Button onClick={() => setDialog({ mode: "create" })}>Nueva tienda</Button>
          ) : undefined
        }
      />

      <DataTable columns={columns} data={stores} isLoading={isLoading} emptyTitle="No hay tiendas" />

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>{dialog?.mode === "edit" ? "Editar tienda" : "Nueva tienda"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <StoreForm
              defaultValues={dialog?.mode === "edit" ? (dialog.store as unknown as Record<string, unknown>) : undefined}
              zones={zones}
              onSubmit={handleSubmit}
              isPending={isPending}
            />
          </DialogBody>
          <DialogFooter>
            <DialogClose><Button variant="outline" disabled={isPending}>Cancelar</Button></DialogClose>
            <Button type="submit" form="store-form" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" />
    </svg>
  );
}
