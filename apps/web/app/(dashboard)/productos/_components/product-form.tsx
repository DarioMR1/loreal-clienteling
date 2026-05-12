"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateProduct, PRODUCT_CATEGORIES } from "@loreal/contracts";
import { createProductSchema } from "@/lib/schemas/products";
import { useUploadProductImage } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Brand } from "@/lib/hooks";

const CATEGORY_LABEL: Record<string, string> = {
  skincare: "Skincare",
  makeup: "Maquillaje",
  fragrance: "Fragancia",
};

interface ProductFormProps {
  defaultValues?: Partial<CreateProduct> & { images?: string[] };
  brands: Brand[];
  onSubmit: (data: CreateProduct & { images?: string[] }) => void;
  isPending: boolean;
}

export function ProductForm({
  defaultValues,
  brands,
  onSubmit,
  isPending,
}: ProductFormProps) {
  const brandMap = Object.fromEntries(
    brands.map((b) => [b.id, b.displayName]),
  );
  const uploadImage = useUploadProductImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(
    (defaultValues as any)?.images ?? [],
  );

  const form = useForm<CreateProduct>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      sku: defaultValues?.sku ?? "",
      name: defaultValues?.name ?? "",
      brandId: defaultValues?.brandId ?? "",
      category: defaultValues?.category ?? PRODUCT_CATEGORIES[0],
      subcategory: defaultValues?.subcategory ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? (0 as unknown as number),
      estimatedDurationDays: defaultValues?.estimatedDurationDays,
    },
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadImage.mutateAsync(file);
      setImages((prev) => [...prev, result.url]);
    } catch {
      // Upload failed silently — user can retry
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(data: CreateProduct) {
    onSubmit({ ...data, images: images.length > 0 ? images : undefined });
  }

  return (
    <Form {...form}>
      <form
        id="product-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        {/* Image upload section */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Imágenes del producto
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div
                key={i}
                className="group relative size-24 overflow-hidden rounded-xl border border-border/50 bg-muted"
              >
                <img
                  src={url}
                  alt={`Imagen ${i + 1}`}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 rounded-md bg-background/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadImage.isPending || isPending}
              className="flex size-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border/50 bg-muted/30 text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
            >
              {uploadImage.isPending ? (
                <span className="text-xs">Subiendo...</span>
              ) : (
                <>
                  <PlusIcon className="size-5" />
                  <span className="text-[10px]">Agregar</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            JPEG, PNG o WebP. Máximo 50MB por imagen.
          </p>
        </div>

        {/* SKU + Name */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="LAN-SK-0001"
                    disabled={isPending}
                    className="font-mono"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Advanced Génifique Sérum"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Brand + Category */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={isPending}>
                      <SelectValue placeholder="Seleccionar marca">
                        {field.value
                          ? (brandMap[field.value] ?? field.value)
                          : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={isPending}>
                      <SelectValue placeholder="Seleccionar categoría">
                        {field.value
                          ? (CATEGORY_LABEL[field.value] ?? field.value)
                          : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABEL[cat] ?? cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price + Duration */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (MXN)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1500.00"
                    disabled={isPending}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedDurationDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración estimada (días)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="60"
                    disabled={isPending}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? e.target.value : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={3}
                  placeholder="Tratamiento de skincare premium..."
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}
