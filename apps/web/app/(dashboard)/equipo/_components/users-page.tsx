"use client";

import { useState } from "react";
import { useUsers, useCreateUser, useInviteUser, useStores, useBrands, useZones, type User } from "@/lib/hooks";
import { can } from "@/lib/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import type { UserFormData } from "./user-form";
import { UserForm } from "./user-form";

type DialogState = null | { mode: "create" } | { mode: "invite" };

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
  const [roleFilter, setRoleFilter] = useState<string>("");
  const { data: usersResponse, isLoading } = useUsers(
    roleFilter ? { role: roleFilter } : undefined,
  );
  const users = usersResponse?.data ?? [];
  const { data: stores = [] } = useStores();
  const { data: brands = [] } = useBrands();
  const { data: zones = [] } = useZones();
  const createUser = useCreateUser();
  const inviteUser = useInviteUser();
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
      key: "storeName" as any,
      label: "Tienda",
      render: (v, row) => (row as any).storeName ?? storeMap[(row as any).storeId] ?? "—",
    },
    {
      key: "brandName" as any,
      label: "Marca",
      render: (v, row) => (row as any).brandName ?? brandMap[(row as any).brandId] ?? "—",
    },
    {
      key: "active",
      label: "Estado",
      render: (v, row) => {
        const inv = (row as any).invitationStatus;
        if (inv === "pending") return <Badge variant="warning" size="sm">Pendiente</Badge>;
        return (
          <Badge variant={v ? "success" : "destructive"} size="sm">
            {v ? "Activo" : "Inactivo"}
          </Badge>
        );
      },
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
        description={`${usersResponse?.total ?? 0} usuarios`}
        action={
          can(role, "user.manage") ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialog({ mode: "invite" })}>
                Invitar
              </Button>
              <Button onClick={() => setDialog({ mode: "create" })}>
                Nuevo usuario
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* Filter bar */}
      <div className="flex gap-2">
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? "")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Todos los roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los roles</SelectItem>
            <SelectItem value="ba">Beauty Advisor</SelectItem>
            <SelectItem value="manager">Gerente</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={users} isLoading={isLoading} emptyTitle="No hay usuarios" />

      {/* Create user dialog */}
      <Dialog open={dialog?.mode === "create"} onOpenChange={(open) => !open && setDialog(null)}>
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

      {/* Invite user dialog */}
      <Dialog open={dialog?.mode === "invite"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Invitar usuario</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="mb-4 text-sm text-muted-foreground">
              Se enviará una invitación por correo electrónico. El usuario aparecerá como
              &quot;Pendiente&quot; hasta que acepte.
            </p>
            <UserForm
              stores={stores}
              brands={brands}
              zones={zones}
              onSubmit={(data) => {
                inviteUser.mutate(
                  {
                    email: data.email,
                    fullName: data.fullName,
                    role: data.role,
                    storeId: data.storeId,
                    zoneId: data.zoneId,
                    brandId: data.brandId,
                  },
                  { onSuccess: () => setDialog(null) },
                );
              }}
              isPending={inviteUser.isPending}
              hidePassword
            />
          </DialogBody>
          <DialogFooter>
            <DialogClose><Button variant="outline" disabled={inviteUser.isPending}>Cancelar</Button></DialogClose>
            <Button type="submit" form="user-form" disabled={inviteUser.isPending}>
              {inviteUser.isPending ? "Enviando..." : "Enviar invitación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
