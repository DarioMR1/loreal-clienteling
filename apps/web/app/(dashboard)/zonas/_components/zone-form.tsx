"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ZoneFormData {
  code: string;
  displayName: string;
  region?: string;
}

interface ZoneFormProps {
  defaultValues?: ZoneFormData;
  onSubmit: (data: ZoneFormData) => void;
  isPending: boolean;
}

export function ZoneForm({ defaultValues, onSubmit, isPending }: ZoneFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      code: formData.get("code") as string,
      displayName: formData.get("displayName") as string,
      region: (formData.get("region") as string) || undefined,
    });
  }

  return (
    <form id="zone-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Código</Label>
        <Input
          id="code"
          name="code"
          placeholder="CENTRO"
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
          placeholder="Zona Centro"
          defaultValue={defaultValues?.displayName}
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">Región (opcional)</Label>
        <Input
          id="region"
          name="region"
          placeholder="Ciudad de México y Estado de México"
          defaultValue={defaultValues?.region ?? ""}
          disabled={isPending}
        />
      </div>
    </form>
  );
}
