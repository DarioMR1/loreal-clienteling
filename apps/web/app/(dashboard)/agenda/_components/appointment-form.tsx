"use client";

import { useState } from "react";
import { APPOINTMENT_EVENT_TYPES } from "@loreal/contracts";
import { useCustomerSearch, type Customer } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const EVENT_LABELS: Record<string, string> = {
  cabin_service: "Servicio cabina",
  facial: "Facial",
  anniversary_event: "Evento aniversario",
  vip_cabin: "Cabina VIP",
  product_followup: "Seguimiento producto",
  custom: "Personalizado",
};

export interface AppointmentFormData {
  customerId: string;
  eventType: string;
  scheduledAt: string;
  durationMinutes: number;
  comments?: string;
  isVirtual: boolean;
  videoLink?: string;
}

interface AppointmentFormProps {
  defaultValues?: Partial<AppointmentFormData>;
  onSubmit: (data: AppointmentFormData) => void;
  isPending: boolean;
}

export function AppointmentForm({
  defaultValues,
  onSubmit,
  isPending,
}: AppointmentFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showResults, setShowResults] = useState(false);
  const [isVirtual, setIsVirtual] = useState(defaultValues?.isVirtual ?? false);

  const { data: searchResults = [] } = useCustomerSearch(searchQuery);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const customerId =
      selectedCustomer?.id ?? defaultValues?.customerId ?? "";
    if (!customerId) return;

    onSubmit({
      customerId,
      eventType: fd.get("eventType") as string,
      scheduledAt: fd.get("scheduledAt") as string,
      durationMinutes: Number(fd.get("durationMinutes")),
      comments: (fd.get("comments") as string) || undefined,
      isVirtual,
      videoLink: isVirtual
        ? (fd.get("videoLink") as string) || undefined
        : undefined,
    });
  }

  return (
    <form id="appointment-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Customer search */}
      {!defaultValues?.customerId && (
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
                    <span className="ml-2 text-muted-foreground">
                      {c.email}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Tipo de evento</Label>
        <Select
          defaultValue={defaultValues?.eventType ?? APPOINTMENT_EVENT_TYPES[0]}
          name="eventType"
          disabled={isPending}
        >
          <SelectTrigger placeholder="Seleccionar tipo" />
          <SelectContent>
            {APPOINTMENT_EVENT_TYPES.map((et) => (
              <SelectItem key={et} value={et}>
                {EVENT_LABELS[et] ?? et}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="scheduledAt">Fecha y hora</Label>
          <Input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            defaultValue={defaultValues?.scheduledAt?.slice(0, 16)}
            required
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duración (min)</Label>
          <Input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min="15"
            max="480"
            step="15"
            defaultValue={defaultValues?.durationMinutes ?? 60}
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comentarios</Label>
        <Textarea
          id="comments"
          name="comments"
          placeholder="Notas sobre la cita..."
          defaultValue={defaultValues?.comments}
          disabled={isPending}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isVirtual"
          checked={isVirtual}
          onChange={(e) => setIsVirtual(e.target.checked)}
          disabled={isPending}
          className="size-4 rounded border-border"
        />
        <Label htmlFor="isVirtual">Cita virtual</Label>
      </div>

      {isVirtual && (
        <div className="space-y-2">
          <Label htmlFor="videoLink">Link de videollamada</Label>
          <Input
            id="videoLink"
            name="videoLink"
            type="url"
            placeholder="https://zoom.us/j/..."
            defaultValue={defaultValues?.videoLink}
            disabled={isPending}
          />
        </div>
      )}
    </form>
  );
}
