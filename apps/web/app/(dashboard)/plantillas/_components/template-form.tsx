"use client";

import { COMMUNICATION_CHANNELS, FOLLOWUP_TYPES } from "@loreal/contracts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import type { Brand } from "@/lib/hooks";

export interface TemplateFormData {
  name: string;
  brandId?: string;
  channel: string;
  followupType: string;
  body: string;
}

const CHANNEL_LABELS: Record<string, string> = { whatsapp: "WhatsApp", sms: "SMS", email: "Email" };
const FOLLOWUP_LABELS: Record<string, string> = {
  "3_months": "3 meses", "6_months": "6 meses", birthday: "Cumpleaños",
  replenishment: "Reposición", special_event: "Evento especial", custom: "Personalizado",
};

interface TemplateFormProps {
  defaultValues?: Record<string, unknown>;
  brands: Brand[];
  onSubmit: (data: TemplateFormData) => void;
  isPending: boolean;
}

export function TemplateForm({ defaultValues: dv, brands, onSubmit, isPending }: TemplateFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultValues = dv as any;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      name: fd.get("name") as string,
      brandId: (fd.get("brandId") as string) || undefined,
      channel: fd.get("channel") as string,
      followupType: fd.get("followupType") as string,
      body: fd.get("body") as string,
    });
  }

  return (
    <form id="template-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" placeholder="Seguimiento 3 meses" defaultValue={defaultValues?.name} required disabled={isPending} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Marca</Label>
          <Select defaultValue={defaultValues?.brandId ?? ""} name="brandId" disabled={isPending}>
            <SelectTrigger placeholder="Global" />
            <SelectContent>
              <SelectItem value="">Global (todas)</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.displayName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Canal</Label>
          <Select defaultValue={defaultValues?.channel ?? COMMUNICATION_CHANNELS[0]} name="channel" disabled={isPending}>
            <SelectTrigger placeholder="Canal" />
            <SelectContent>
              {COMMUNICATION_CHANNELS.map((ch) => (
                <SelectItem key={ch} value={ch}>{CHANNEL_LABELS[ch] ?? ch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo de seguimiento</Label>
          <Select defaultValue={defaultValues?.followupType ?? FOLLOWUP_TYPES[0]} name="followupType" disabled={isPending}>
            <SelectTrigger placeholder="Tipo" />
            <SelectContent>
              {FOLLOWUP_TYPES.map((ft) => (
                <SelectItem key={ft} value={ft}>{FOLLOWUP_LABELS[ft] ?? ft}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Contenido del mensaje</Label>
        <Textarea
          id="body"
          name="body"
          rows={5}
          placeholder="Hola {{customer.first_name}}, ..."
          defaultValue={defaultValues?.body}
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Usa {"{{customer.first_name}}"}, {"{{product.name}}"}, {"{{appointment.date}}"} como variables.
        </p>
      </div>
    </form>
  );
}
