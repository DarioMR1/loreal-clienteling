"use client";

import { useState } from "react";
import {
  COMMUNICATION_CHANNELS,
  FOLLOWUP_TYPES,
} from "@loreal/contracts";
import { useCustomerSearch, useTemplates, type Customer } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  sms: "SMS",
  email: "Email",
};

const FOLLOWUP_LABELS: Record<string, string> = {
  "3_months": "3 meses",
  "6_months": "6 meses",
  birthday: "Cumpleaños",
  replenishment: "Reposición",
  special_event: "Evento especial",
  custom: "Personalizado",
};

export interface CommunicationFormData {
  customerId: string;
  channel: string;
  templateId?: string;
  subject?: string;
  body: string;
  followupType: string;
}

interface CommunicationFormProps {
  onSubmit: (data: CommunicationFormData) => void;
  isPending: boolean;
}

export function CommunicationForm({
  onSubmit,
  isPending,
}: CommunicationFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [body, setBody] = useState("");

  const { data: searchResults = [] } = useCustomerSearch(searchQuery);
  const { data: templates = [] } = useTemplates();

  function handleTemplateChange(templateId: string | null) {
    if (!templateId) return;
    const tpl = templates.find((t) => t.id === templateId);
    if (tpl) setBody(tpl.body);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!selectedCustomer) return;

    onSubmit({
      customerId: selectedCustomer.id,
      channel: fd.get("channel") as string,
      subject: (fd.get("subject") as string) || undefined,
      body,
      followupType: fd.get("followupType") as string,
    });
  }

  return (
    <form id="communication-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Customer search */}
      <div className="relative space-y-2">
        <Label>Clienta</Label>
        <Input
          placeholder="Buscar clienta..."
          value={
            selectedCustomer
              ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
              : searchQuery
          }
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedCustomer(null);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          disabled={isPending}
        />
        {showResults && searchResults.length > 0 && !selectedCustomer && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
            {searchResults.map((c) => (
              <button
                key={c.id}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50"
                onClick={() => {
                  setSelectedCustomer(c);
                  setShowResults(false);
                  setSearchQuery("");
                }}
              >
                {c.firstName} {c.lastName}
                {c.email && (
                  <span className="ml-2 text-muted-foreground">{c.email}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Canal</Label>
          <Select
            defaultValue={COMMUNICATION_CHANNELS[0]}
            name="channel"
            disabled={isPending}
          >
            <SelectTrigger placeholder="Seleccionar canal" />
            <SelectContent>
              {COMMUNICATION_CHANNELS.map((ch) => (
                <SelectItem key={ch} value={ch}>
                  {CHANNEL_LABELS[ch] ?? ch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo de seguimiento</Label>
          <Select
            defaultValue={FOLLOWUP_TYPES[0]}
            name="followupType"
            disabled={isPending}
          >
            <SelectTrigger placeholder="Seleccionar tipo" />
            <SelectContent>
              {FOLLOWUP_TYPES.map((ft) => (
                <SelectItem key={ft} value={ft}>
                  {FOLLOWUP_LABELS[ft] ?? ft}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template selector */}
      {templates.length > 0 && (
        <div className="space-y-2">
          <Label>Plantilla (opcional)</Label>
          <Select
            onValueChange={(v) => handleTemplateChange(v as string | null)}
            disabled={isPending}
          >
            <SelectTrigger placeholder="Seleccionar plantilla" />
            <SelectContent>
              {templates.map((tpl) => (
                <SelectItem key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="subject">Asunto (solo email)</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Asunto del mensaje..."
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Mensaje</Label>
        <Textarea
          id="body"
          name="body"
          placeholder="Escribe el mensaje..."
          required
          disabled={isPending}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
        />
      </div>
    </form>
  );
}
