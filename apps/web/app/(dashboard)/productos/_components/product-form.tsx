"use client";

import { PRODUCT_CATEGORIES } from "@loreal/contracts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import type { Brand } from "@/lib/hooks";

export interface ProductFormData {
  sku: string;
  name: string;
  brandId: string;
  category: string;
  subcategory?: string;
  description?: string;
  price: string;
  estimatedDurationDays?: number;
}

const CATEGORY_LABEL: Record<string, string> = {
  skincare: "Skincare",
  makeup: "Maquillaje",
  fragrance: "Fragancia",
};

interface ProductFormProps {
  defaultValues?: Record<string, unknown>;
  brands: Brand[];
  onSubmit: (data: ProductFormData) => void;
  isPending: boolean;
}

export function ProductForm({ defaultValues: dv, brands, onSubmit, isPending }: ProductFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultValues = dv as any;
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const days = fd.get("estimatedDurationDays") as string;
    onSubmit({
      sku: fd.get("sku") as string,
      name: fd.get("name") as string,
      brandId: fd.get("brandId") as string,
      category: fd.get("category") as string,
      subcategory: (fd.get("subcategory") as string) || undefined,
      description: (fd.get("description") as string) || undefined,
      price: fd.get("price") as string,
      estimatedDurationDays: days ? Number(days) : undefined,
    });
  }

  return (
    <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" placeholder="LAN-SK-0001" defaultValue={defaultValues?.sku} required disabled={isPending} className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" placeholder="Advanced Génifique Sérum" defaultValue={defaultValues?.name} required disabled={isPending} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Marca</Label>
          <Select defaultValue={defaultValues?.brandId ?? ""} name="brandId" disabled={isPending}>
            <SelectTrigger placeholder="Seleccionar marca" />
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.displayName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select defaultValue={defaultValues?.category ?? PRODUCT_CATEGORIES[0]} name="category" disabled={isPending}>
            <SelectTrigger placeholder="Seleccionar categoría" />
            <SelectContent>
              {PRODUCT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{CATEGORY_LABEL[cat] ?? cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Precio (MXN)</Label>
          <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="1500.00" defaultValue={defaultValues?.price} required disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedDurationDays">Duración estimada (días)</Label>
          <Input id="estimatedDurationDays" name="estimatedDurationDays" type="number" min="1" placeholder="60" defaultValue={defaultValues?.estimatedDurationDays ?? ""} disabled={isPending} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={3} placeholder="Tratamiento de skincare premium..." defaultValue={defaultValues?.description ?? ""} disabled={isPending} />
      </div>
    </form>
  );
}
