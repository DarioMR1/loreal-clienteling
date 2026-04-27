"use client";

import { useState } from "react";
import { useUsers, useCreateUser, useStores, useBrands, useZones, type User } from "@/lib/hooks";
import { can } from "@/lib/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import type { UserFormData } from "./user-form";
import { UserForm } from "./user-form";

type DialogState = null | { mode: "create" };

const ROLE_LABEL: Record<string, string> = {
  ba: "Beauty Advisor",
  manager: "Gerente",
  supervisor: "Supervisor",
  admin: "Administrador",
};

const ROLE_VARIANT: Record<string, "default" | "info" | "warning" | "destructive"> = {
  admin: "destructive",
  supervisor: "warning",
  manager: "info",
  ba: "default",
};

interface UsersPageProps {
  user: { role?: string | null };
}

export function UsersPage({ user }: UsersPageProps) {
  const role = user.role ?? "ba";
  const { data: users = [], isLoading } = useUsers();
  const { data: stores = [] } = useStores();
  const { data: brands = [] } = useBrands();
  const { data: zones = [] } = useZones();
  const createUser = useCreateUser();
  const [dialog, setDialog] = useState<DialogState>(null);

  const storeMap = Object.fromEntries(stores.map((s) => [s.id, s.displayName]));
  const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.displayName]));

  const columns: Column<User>[] = [
    { key: "fullName", label: "Nombre" },
    { key: "email", label: "Correo" },
    {
      key: "role",
      label: "Rol",
      render: (v) => {
        const r = v as string;
        return <Badge variant={ROLE_VARIANT[r] ?? "default"}>{ROLE_LABEL[r] ?? r}</Badge>;
      },
    },
    {
      key: "storeId",
      label: "Tienda",
      render: (v) => storeMap[v as string] ?? "—",
    },
    {
      key: "brandId",
      label: "Marca",
      render: (v) => brandMap[v as string] ?? "—",
    },
    {
      key: "active",
      label: "Estado",
      render: (v) => (
        <Badge variant={v ? "success" : "destructive"} size="sm">
          {v ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
  ];

  function handleSubmit(data: UserFormData) {
    createUser.mutate(
      { ...data, name: data.fullName },
      { onSuccess: () => setDialog(null) },
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Equipo"
        description="Usuarios internos del sistema"
        action={
          can(role, "user.manage") ? (
            <Button onClick={() => setDialog({ mode: "create" })}>Nuevo usuario</Button>
          ) : undefined
        }
      />

      <DataTable columns={columns} data={users} isLoading={isLoading} emptyTitle="No hay usuarios" />

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Nuevo usuario</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <UserForm
              stores={stores}
              brands={brands}
              zones={zones}
              onSubmit={handleSubmit}
              isPending={createUser.isPending}
            />
          </DialogBody>
          <DialogFooter>
            <DialogClose><Button variant="outline" disabled={createUser.isPending}>Cancelar</Button></DialogClose>
            <Button type="submit" form="user-form" disabled={createUser.isPending}>
              {createUser.isPending ? "Creando..." : "Crear usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
