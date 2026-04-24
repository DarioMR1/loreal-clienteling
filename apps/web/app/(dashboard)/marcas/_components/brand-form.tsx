"use client";

import { BRAND_TIERS } from "@loreal/contracts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export interface BrandFormData {
  code: string;
  displayName: string;
  tier: string;
}

const TIER_LABELS: Record<string, string> = {
  luxury: "Lujo",
  premium: "Premium",
  mass: "Masivo",
};

interface BrandFormProps {
  defaultValues?: BrandFormData;
  onSubmit: (data: BrandFormData) => void;
  isPending: boolean;
}

export function BrandForm({ defaultValues, onSubmit, isPending }: BrandFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      code: formData.get("code") as string,
      displayName: formData.get("displayName") as string,
      tier: formData.get("tier") as string,
    });
  }

  return (
    <form id="brand-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Código</Label>
        <Input
          id="code"
          name="code"
          placeholder="LANCOME"
          defaultValue={defaultValues?.code}
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Nombre</Label>
        <Input
          id="displayName"
          name="displayName"
          placeholder="Lancôme"
          defaultValue={defaultValues?.displayName}
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label>Segmento</Label>
        <Select defaultValue={defaultValues?.tier ?? BRAND_TIERS[0]} name="tier" disabled={isPending}>
          <SelectTrigger placeholder="Seleccionar segmento" />
          <SelectContent>
            {BRAND_TIERS.map((tier) => (
              <SelectItem key={tier} value={tier}>
                {TIER_LABELS[tier] ?? tier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
