"use client";

import { useState } from "react";
import { useBrands, useCreateBrand, useUpdateBrand, type Brand } from "@/lib/hooks";
import { can } from "@/lib/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
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
import { BrandForm, type BrandFormData } from "./brand-form";

type DialogState = null | { mode: "create" } | { mode: "edit"; brand: Brand };

const TIER_VARIANT: Record<string, "info" | "default" | "secondary"> = {
  luxury: "default",
  premium: "info",
  mass: "secondary",
};

const TIER_LABEL: Record<string, string> = {
  luxury: "Lujo",
  premium: "Premium",
  mass: "Masivo",
};

interface BrandsPageProps {
  user: { role?: string | null };
}

export function BrandsPage({ user }: BrandsPageProps) {
  const role = user.role ?? "ba";
  const { data: brands = [], isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const [dialog, setDialog] = useState<DialogState>(null);

  const columns: Column<Brand>[] = [
    { key: "code", label: "Código" },
    { key: "displayName", label: "Nombre" },
    {
      key: "tier",
      label: "Segmento",
      render: (v) => {
        const tier = v as string;
        return (
          <Badge variant={TIER_VARIANT[tier] ?? "secondary"}>
            {TIER_LABEL[tier] ?? tier}
          </Badge>
        );
      },
    },
    {
      key: "active",
      label: "Estado",
      render: (v) => (
        <Badge variant={v ? "success" : "destructive"} size="sm">
          {v ? "Activa" : "Inactiva"}
        </Badge>
      ),
    },
    ...(can(role, "brand.edit")
      ? [
          {
            key: "actions" as const,
            label: "",
            className: "w-10",
            render: (_: unknown, row: Brand) => (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setDialog({ mode: "edit", brand: row })}
              >
                <EditIcon className="size-3.5" />
              </Button>
            ),
          },
        ]
      : []),
  ];

  function handleSubmit(data: BrandFormData) {
    if (dialog?.mode === "edit") {
      updateBrand.mutate(
        { id: dialog.brand.id, ...data },
        { onSuccess: () => setDialog(null) },
      );
    } else {
      createBrand.mutate(data, { onSuccess: () => setDialog(null) });
    }
  }

  const isPending = createBrand.isPending || updateBrand.isPending;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Marcas"
        description="Portafolio de marcas L'Oréal"
        action={
          can(role, "brand.create") ? (
            <Button onClick={() => setDialog({ mode: "create" })}>
              Nueva marca
            </Button>
          ) : undefined
        }
      />

      <DataTable
        columns={columns}
        data={brands}
        isLoading={isLoading}
        emptyTitle="No hay marcas"
        emptyDescription="Crea la primera marca del portafolio"
      />

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog?.mode === "edit" ? "Editar marca" : "Nueva marca"}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <BrandForm
              defaultValues={dialog?.mode === "edit" ? dialog.brand : undefined}
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
            <Button type="submit" form="brand-form" disabled={isPending}>
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
