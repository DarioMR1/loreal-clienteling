"use client";

import { USER_ROLES } from "@loreal/contracts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import type { Store, Brand, Zone } from "@/lib/hooks";

export interface UserFormData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  storeId?: string;
  brandId?: string;
  zoneId?: string;
}

const ROLE_LABELS: Record<string, string> = {
  ba: "Beauty Advisor",
  manager: "Gerente",
  supervisor: "Supervisor",
  admin: "Administrador",
};

interface UserFormProps {
  stores: Store[];
  brands: Brand[];
  zones: Zone[];
  onSubmit: (data: UserFormData) => void;
  isPending: boolean;
}

export function UserForm({ stores, brands, zones, onSubmit, isPending }: UserFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      fullName: fd.get("fullName") as string,
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      role: fd.get("role") as string,
      storeId: (fd.get("storeId") as string) || undefined,
      brandId: (fd.get("brandId") as string) || undefined,
      zoneId: (fd.get("zoneId") as string) || undefined,
    });
  }

  return (
    <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input id="fullName" name="fullName" placeholder="Ana Martínez Ruiz" required disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input id="email" name="email" type="email" placeholder="a.martinez@loreal.mx" required disabled={isPending} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" minLength={8} required disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label>Rol</Label>
          <Select defaultValue="ba" name="role" disabled={isPending}>
            <SelectTrigger placeholder="Seleccionar rol" />
            <SelectContent>
              {USER_ROLES.map((r) => (
                <SelectItem key={r} value={r}>{ROLE_LABELS[r] ?? r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Tienda</Label>
          <Select defaultValue="" name="storeId" disabled={isPending}>
            <SelectTrigger placeholder="Seleccionar tienda" />
            <SelectContent>
              <SelectItem value="">Sin asignar</SelectItem>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.displayName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Marca</Label>
          <Select defaultValue="" name="brandId" disabled={isPending}>
            <SelectTrigger placeholder="Seleccionar marca" />
            <SelectContent>
              <SelectItem value="">Sin asignar</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.displayName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Zona</Label>
          <Select defaultValue="" name="zoneId" disabled={isPending}>
            <SelectTrigger placeholder="Seleccionar zona" />
            <SelectContent>
              <SelectItem value="">Sin asignar</SelectItem>
              {zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>{z.displayName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
}
