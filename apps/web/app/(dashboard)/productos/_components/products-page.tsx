"use client";

import { useState } from "react";
import { useProducts, useBrands, useCreateProduct, useUpdateProduct, type Product } from "@/lib/hooks";
import { can } from "@/lib/permissions";
import { PRODUCT_CATEGORIES } from "@loreal/contracts";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { ProductForm, type ProductFormData } from "./product-form";

type DialogState = null | { mode: "create" } | { mode: "edit"; product: Product };

const CATEGORY_LABEL: Record<string, string> = {
  skincare: "Skincare",
  makeup: "Maquillaje",
  fragrance: "Fragancia",
};

const CATEGORY_VARIANT: Record<string, "info" | "default" | "warning"> = {
  skincare: "info",
  makeup: "default",
  fragrance: "warning",
};

interface ProductsPageProps {
  user: { role?: string | null };
}

export function ProductsPage({ user }: ProductsPageProps) {
  const role = user.role ?? "ba";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { data: brands = [] } = useBrands();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [dialog, setDialog] = useState<DialogState>(null);

  const params: Record<string, string> = { page: String(page), limit: "20" };
  if (search) params.search = search;
  if (category) params.category = category;

  const { data: products = [], isLoading } = useProducts(params);

  const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.displayName]));

  const columns: Column<Product>[] = [
    { key: "sku", label: "SKU", className: "font-mono text-xs" },
    { key: "name", label: "Nombre" },
    {
      key: "brandId",
      label: "Marca",
      render: (v) => brandMap[v as string] ?? "—",
    },
    {
      key: "category",
      label: "Categoría",
      render: (v) => {
        const cat = v as string;
        return <Badge variant={CATEGORY_VARIANT[cat] ?? "secondary"}>{CATEGORY_LABEL[cat] ?? cat}</Badge>;
      },
    },
    {
      key: "price",
      label: "Precio",
      className: "text-right tabular-nums",
      render: (v) => `$${Number(v).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "active",
      label: "Estado",
      render: (v) => (
        <Badge variant={v ? "success" : "destructive"} size="sm">{v ? "Activo" : "Inactivo"}</Badge>
      ),
    },
    ...(can(role, "product.edit")
      ? [{
          key: "actions" as const,
          label: "",
          className: "w-10",
          render: (_: unknown, row: Product) => (
            <Button variant="ghost" size="icon-xs" onClick={() => setDialog({ mode: "edit", product: row })}>
              <EditIcon className="size-3.5" />
            </Button>
          ),
        }]
      : []),
  ];

  function handleSubmit(data: ProductFormData) {
    if (dialog?.mode === "edit") {
      updateProduct.mutate({ id: dialog.product.id, ...data } as Record<string, unknown> & { id: string }, { onSuccess: () => setDialog(null) });
    } else {
      createProduct.mutate(data as unknown as Record<string, unknown>, { onSuccess: () => setDialog(null) });
    }
  }

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Productos"
        description="Catálogo de productos del portafolio"
        action={
          can(role, "product.create") ? (
            <Button onClick={() => setDialog({ mode: "create" })}>Nuevo producto</Button>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <Select value={category} onValueChange={(v) => { setCategory(v as string); setPage(1); }}>
          <SelectTrigger placeholder="Todas las categorías" className="w-48" />
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {PRODUCT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{CATEGORY_LABEL[cat] ?? cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={products} isLoading={isLoading} emptyTitle="No hay productos" />

      <Pagination page={page} totalPages={Math.ceil(products.length === 20 ? page + 1 : page)} onPageChange={setPage} />

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>{dialog?.mode === "edit" ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <ProductForm
              defaultValues={dialog?.mode === "edit" ? (dialog.product as unknown as Record<string, unknown>) : undefined}
              brands={brands}
              onSubmit={handleSubmit}
              isPending={isPending}
            />
          </DialogBody>
          <DialogFooter>
            <DialogClose><Button variant="outline" disabled={isPending}>Cancelar</Button></DialogClose>
            <Button type="submit" form="product-form" disabled={isPending}>
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
