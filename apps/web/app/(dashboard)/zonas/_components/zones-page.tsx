"use client";

import { useState } from "react";
import { useZones, useCreateZone, useUpdateZone, type Zone } from "@/lib/hooks";
import { can } from "@/lib/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
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
import { ZoneForm, type ZoneFormData } from "./zone-form";

type DialogState = null | { mode: "create" } | { mode: "edit"; zone: Zone };

interface ZonesPageProps {
  user: { role?: string | null };
}

export function ZonesPage({ user }: ZonesPageProps) {
  const role = user.role ?? "ba";
  const { data: zones = [], isLoading } = useZones();
  const createZone = useCreateZone();
  const updateZone = useUpdateZone();
  const [dialog, setDialog] = useState<DialogState>(null);

  const columns: Column<Zone>[] = [
    { key: "code", label: "Código" },
    { key: "displayName", label: "Nombre" },
    { key: "region", label: "Región", render: (v) => (v as string) ?? "—" },
    ...(can(role, "zone.edit")
      ? [
          {
            key: "actions" as const,
            label: "",
            className: "w-10",
            render: (_: unknown, row: Zone) => (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setDialog({ mode: "edit", zone: row })}
              >
                <EditIcon className="size-3.5" />
              </Button>
            ),
          },
        ]
      : []),
  ];

  function handleSubmit(data: ZoneFormData) {
    if (dialog?.mode === "edit") {
      updateZone.mutate(
        { id: dialog.zone.id, ...data },
        { onSuccess: () => setDialog(null) },
      );
    } else {
      createZone.mutate(data, { onSuccess: () => setDialog(null) });
    }
  }

  const isPending = createZone.isPending || updateZone.isPending;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Zonas"
        description="Agrupación de tiendas por región geográfica"
        action={
          can(role, "zone.create") ? (
            <Button onClick={() => setDialog({ mode: "create" })}>
              Nueva zona
            </Button>
          ) : undefined
        }
      />

      <DataTable
        columns={columns}
        data={zones}
        isLoading={isLoading}
        emptyTitle="No hay zonas"
        emptyDescription="Crea la primera zona para organizar tus tiendas"
      />

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog?.mode === "edit" ? "Editar zona" : "Nueva zona"}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <ZoneForm
              defaultValues={dialog?.mode === "edit" ? { ...dialog.zone, region: dialog.zone.region ?? undefined } : undefined}
              onSubmit={handleSubmit}
              isPending={isPending}
            />
          </DialogBody>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="zone-form"
              disabled={isPending}
            >
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
