"use client";

import { STORE_CHAINS } from "@loreal/contracts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import type { Zone } from "@/lib/hooks";

export interface StoreFormData {
  code: string;
  displayName: string;
  chain: string;
  zoneId?: string;
  address?: string;
  city?: string;
  state?: string;
}

const CHAIN_LABELS: Record<string, string> = {
  liverpool: "Liverpool",
  palacio: "Palacio de Hierro",
  owned: "Boutique propia",
};

interface StoreFormProps {
  // Accepts API shape (null) and form shape (undefined) for optional fields
  defaultValues?: Record<string, unknown>;
  zones: Zone[];
  onSubmit: (data: StoreFormData) => void;
  isPending: boolean;
}

export function StoreForm({ defaultValues: dv, zones, onSubmit, isPending }: StoreFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultValues = dv as any;
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      code: fd.get("code") as string,
      displayName: fd.get("displayName") as string,
      chain: fd.get("chain") as string,
      zoneId: (fd.get("zoneId") as string) || undefined,
      address: (fd.get("address") as string) || undefined,
      city: (fd.get("city") as string) || undefined,
      state: (fd.get("state") as string) || undefined,
    });
  }

  return (
    <form id="store-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input id="code" name="code" placeholder="LIV_POLANCO" defaultValue={defaultValues?.code} required disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="displayName">Nombre</Label>
          <Input id="displayName" name="displayName" placeholder="Liverpool Polanco" defaultValue={defaultValues?.displayName} required disabled={isPending} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Cadena</Label>
          <Select defaultValue={defaultValues?.chain ?? STORE_CHAINS[0]} name="chain" disabled={isPending}>
            <SelectTrigger placeholder="Seleccionar cadena" />
            <SelectContent>
              {STORE_CHAINS.map((chain) => (
                <SelectItem key={chain} value={chain}>{CHAIN_LABELS[chain] ?? chain}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Zona</Label>
          <Select defaultValue={defaultValues?.zoneId ?? ""} name="zoneId" disabled={isPending}>
            <SelectTrigger placeholder="Seleccionar zona" />
            <SelectContent>
              <SelectItem value="">Sin zona</SelectItem>
              {zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>{z.displayName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" name="address" placeholder="Av. Molière 222" defaultValue={defaultValues?.address ?? ""} disabled={isPending} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" name="city" placeholder="Ciudad de México" defaultValue={defaultValues?.city ?? ""} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input id="state" name="state" placeholder="CDMX" defaultValue={defaultValues?.state ?? ""} disabled={isPending} />
        </div>
      </div>
    </form>
  );
}
