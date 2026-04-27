"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCustomers,
  useCustomerSearch,
  useCreateCustomer,
  useUpdateCustomer,
  type Customer,
} from "@/lib/hooks";
import { LIFECYCLE_SEGMENTS } from "@loreal/contracts";
import { can } from "@/lib/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { CreateCustomer } from "@loreal/contracts";
import { CustomerForm } from "./customer-form";

// ── Types ──────────────────────────────────────────────────────────

type DialogState =
  | null
  | { mode: "create" }
  | { mode: "edit"; customer: Customer };

// ── Label maps ─────────────────────────────────────────────────────

const SEGMENT_LABEL: Record<string, string> = {
  new: "Nueva",
  returning: "Recurrente",
  vip: "VIP",
  at_risk: "En riesgo",
};

const SEGMENT_VARIANT: Record<
  string,
  "default" | "info" | "success" | "warning" | "destructive"
> = {
  new: "info",
  returning: "default",
  vip: "success",
  at_risk: "warning",
};

// ── Component ──────────────────────────────────────────────────────

interface CustomersPageProps {
  user: { role?: string | null };
}

export function CustomersPage({ user }: CustomersPageProps) {
  const role = user.role ?? "ba";
  const router = useRouter();

  // Filter state
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Data hooks
  const isSearching = search.length >= 2;

  const customersQuery = useCustomers(
    isSearching
      ? undefined
      : {
          page: page.toString(),
          limit: limit.toString(),
          ...(segment ? { segment } : {}),
        },
  );

  const searchQuery = useCustomerSearch(search);

  const customers = isSearching
    ? searchQuery.data ?? []
    : customersQuery.data ?? [];
  const isLoading = isSearching ? searchQuery.isLoading : customersQuery.isLoading;

  // Mutations
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  // Dialog
  const [dialog, setDialog] = useState<DialogState>(null);

  // Columns
  const columns: Column<Customer>[] = [
    {
      key: "firstName",
      label: "Nombre",
      render: (_: unknown, row: Customer) =>
        `${row.firstName} ${row.lastName}`,
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Teléfono" },
    {
      key: "lifecycleSegment",
      label: "Segmento",
      render: (v) => {
        const seg = v as string;
        return (
          <Badge variant={SEGMENT_VARIANT[seg] ?? "secondary"} size="sm">
            {SEGMENT_LABEL[seg] ?? seg}
          </Badge>
        );
      },
    },
    {
      key: "lastTransactionAt",
      label: "Última compra",
      render: (v) => {
        if (!v) return "—";
        return new Date(v as string).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      },
    },
    ...(can(role, "customer.edit")
      ? [
          {
            key: "actions" as const,
            label: "",
            className: "w-10",
            render: (_: unknown, row: Customer) => (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setDialog({ mode: "edit", customer: row });
                }}
              >
                <EditIcon className="size-3.5" />
              </Button>
            ),
          },
        ]
      : []),
  ];

  function handleSubmit(data: CreateCustomer) {
    if (dialog?.mode === "edit") {
      updateCustomer.mutate(
        {
          id: dialog.customer.id,
          ...data,
          birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        },
        { onSuccess: () => setDialog(null) },
      );
    } else {
      createCustomer.mutate(
        {
          ...data,
          birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        },
        { onSuccess: () => setDialog(null) },
      );
    }
  }

  const isPending = createCustomer.isPending || updateCustomer.isPending;

  // Rough page count — the API returns an array, so estimate
  const totalPages = isSearching
    ? 1
    : customers.length < limit
      ? page
      : page + 1;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Clientes"
        description="Gestión de clientas registradas"
        action={
          can(role, "customer.create") ? (
            <Button onClick={() => setDialog({ mode: "create" })}>
              Nueva clienta
            </Button>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={segment}
          onValueChange={(v) => {
            setSegment(v ?? "");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44"><SelectValue placeholder="Todos los segmentos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {LIFECYCLE_SEGMENTS.map((seg) => (
              <SelectItem key={seg} value={seg}>
                {SEGMENT_LABEL[seg] ?? seg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/clientes/${row.id}`)}
        emptyTitle="No hay clientes"
        emptyDescription={
          isSearching
            ? "No se encontraron resultados para tu búsqueda"
            : "Registra la primera clienta"
        }
      />

      {/* Pagination */}
      {!isSearching && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog?.mode === "edit" ? "Editar clienta" : "Nueva clienta"}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <CustomerForm
              defaultValues={
                dialog?.mode === "edit"
                  ? {
                      firstName: dialog.customer.firstName,
                      lastName: dialog.customer.lastName,
                      email: dialog.customer.email ?? undefined,
                      phone: dialog.customer.phone ?? undefined,
                      gender: dialog.customer.gender ?? undefined,
                      birthDate: dialog.customer.birthDate ?? undefined,
                    }
                  : undefined
              }
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
            <Button type="submit" form="customer-form" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────

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

function EditIcon({ className }: { className?: string }) {
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
      <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" />
    </svg>
  );
}
