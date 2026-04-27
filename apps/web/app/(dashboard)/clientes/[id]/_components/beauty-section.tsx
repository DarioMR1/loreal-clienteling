"use client";

import { useState } from "react";
import { useBeautyProfile, useUpsertBeautyProfile, useAddShade } from "@/lib/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Shade } from "@/lib/hooks/use-customer-detail";

const SKIN_TYPE_LABELS: Record<string, string> = {
  dry: "Seca",
  oily: "Grasa",
  combination: "Mixta",
  sensitive: "Sensible",
  normal: "Normal",
};

const SKIN_TONE_LABELS: Record<string, string> = {
  fair: "Clara",
  light: "Ligera",
  medium: "Media",
  tan: "Morena",
  deep: "Oscura",
};

const SUBTONE_LABELS: Record<string, string> = {
  cool: "Frío",
  neutral: "Neutro",
  warm: "Cálido",
};

const SHADE_CATEGORY_LABELS: Record<string, string> = {
  foundation: "Base",
  concealer: "Corrector",
  lipstick: "Labial",
  blush: "Rubor",
};

type DialogState = null | "edit-profile" | "add-shade";

interface BeautySectionProps {
  customerId: string;
  role: string;
}

export function BeautySection({ customerId }: BeautySectionProps) {
  const { data: profile, isLoading } = useBeautyProfile(customerId);
  const upsertProfile = useUpsertBeautyProfile();
  const addShade = useAddShade();
  const [dialog, setDialog] = useState<DialogState>(null);

  const shadeColumns: Column<Shade>[] = [
    {
      key: "category",
      label: "Categoría",
      render: (v) => SHADE_CATEGORY_LABELS[v as string] ?? (v as string),
    },
    { key: "shadeCode", label: "Código de tono" },
    {
      key: "capturedAt",
      label: "Fecha",
      render: (v) =>
        new Date(v as string).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    upsertProfile.mutate(
      {
        customerId,
        skinType: fd.get("skinType") as string || undefined,
        skinTone: fd.get("skinTone") as string || undefined,
        skinSubtone: fd.get("skinSubtone") as string || undefined,
        skinConcerns: (fd.get("skinConcerns") as string)
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) || undefined,
      },
      { onSuccess: () => setDialog(null) },
    );
  }

  function handleShadeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addShade.mutate(
      {
        customerId,
        category: fd.get("category") as string,
        brandId: fd.get("brandId") as string,
        productId: fd.get("productId") as string,
        shadeCode: fd.get("shadeCode") as string,
      },
      { onSuccess: () => setDialog(null) },
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="space-y-3">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPending = upsertProfile.isPending || addShade.isPending;

  return (
    <div className="space-y-4">
      {/* Beauty profile card */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil de belleza</CardTitle>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialog("edit-profile")}
            >
              {profile ? "Editar" : "Capturar"}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {profile ? (
            <dl className="grid gap-4 text-sm sm:grid-cols-3">
              <div className="space-y-0.5">
                <dt className="text-muted-foreground">Tipo de piel</dt>
                <dd>
                  {profile.skinType ? (
                    <Badge variant="secondary">
                      {SKIN_TYPE_LABELS[profile.skinType] ?? profile.skinType}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div className="space-y-0.5">
                <dt className="text-muted-foreground">Tono</dt>
                <dd>
                  {profile.skinTone ? (
                    <Badge variant="secondary">
                      {SKIN_TONE_LABELS[profile.skinTone] ?? profile.skinTone}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div className="space-y-0.5">
                <dt className="text-muted-foreground">Subtono</dt>
                <dd>
                  {profile.skinSubtone ? (
                    <Badge variant="secondary">
                      {SUBTONE_LABELS[profile.skinSubtone] ?? profile.skinSubtone}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              {profile.skinConcerns && profile.skinConcerns.length > 0 && (
                <div className="space-y-0.5 sm:col-span-3">
                  <dt className="text-muted-foreground">Preocupaciones</dt>
                  <dd className="flex flex-wrap gap-1">
                    {profile.skinConcerns.map((c) => (
                      <Badge key={c} variant="secondary" size="sm">
                        {c}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sin perfil de belleza capturado.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Shades */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de tonos</CardTitle>
          <CardDescription>Tonos capturados por categoría</CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialog("add-shade")}
            >
              Agregar tono
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={shadeColumns}
            data={profile?.shades ?? []}
            isLoading={false}
            emptyTitle="Sin tonos"
            emptyDescription="Agrega el primer tono de la clienta"
          />
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog
        open={dialog === "edit-profile"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {profile ? "Editar perfil de belleza" : "Capturar perfil de belleza"}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <form
              id="beauty-form"
              onSubmit={handleProfileSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Tipo de piel</Label>
                <Select
                  defaultValue={profile?.skinType ?? ""}
                  name="skinType"
                  disabled={isPending}
                >
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(SKIN_TYPE_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tono</Label>
                  <Select
                    defaultValue={profile?.skinTone ?? ""}
                    name="skinTone"
                    disabled={isPending}
                  >
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(SKIN_TONE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subtono</Label>
                  <Select
                    defaultValue={profile?.skinSubtone ?? ""}
                    name="skinSubtone"
                    disabled={isPending}
                  >
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(SUBTONE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skinConcerns">
                  Preocupaciones (separadas por coma)
                </Label>
                <Input
                  id="skinConcerns"
                  name="skinConcerns"
                  placeholder="acné, envejecimiento, pigmentación"
                  defaultValue={profile?.skinConcerns?.join(", ") ?? ""}
                  disabled={isPending}
                />
              </div>
            </form>
          </DialogBody>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" form="beauty-form" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Shade Dialog */}
      <Dialog
        open={dialog === "add-shade"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar tono</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <form
              id="shade-form"
              onSubmit={handleShadeSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select name="category" disabled={isPending}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(SHADE_CATEGORY_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shadeCode">Código de tono</Label>
                <Input
                  id="shadeCode"
                  name="shadeCode"
                  placeholder="N°2 Lys Rosé"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandId">ID de marca</Label>
                <Input
                  id="brandId"
                  name="brandId"
                  placeholder="UUID de la marca"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productId">ID de producto</Label>
                <Input
                  id="productId"
                  name="productId"
                  placeholder="UUID del producto"
                  required
                  disabled={isPending}
                />
              </div>
            </form>
          </DialogBody>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" form="shade-form" disabled={isPending}>
              {isPending ? "Guardando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
