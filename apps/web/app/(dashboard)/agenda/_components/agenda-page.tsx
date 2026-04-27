"use client";

import { useState } from "react";
import {
  useAppointmentCalendar,
  useCreateAppointment,
  useUpdateAppointment,
  type Appointment,
} from "@/lib/hooks";
import { APPOINTMENT_STATUSES } from "@loreal/contracts";
import { can } from "@/lib/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { WeekCalendar } from "./week-calendar";
import type { AppointmentFormData } from "./appointment-form";
import { AppointmentForm } from "./appointment-form";
import { STATUS_LABEL, STATUS_VARIANT, EVENT_LABEL } from "./appointment-card";

// ── Helpers ────────────────────────────────────────────────────────

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateRange(start: Date): string {
  const end = addDays(start, 6);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const startStr = start.toLocaleDateString("es-MX", opts);
  const endStr = end.toLocaleDateString("es-MX", {
    ...opts,
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

// ── Types ──────────────────────────────────────────────────────────

type DialogState =
  | null
  | { mode: "create" }
  | { mode: "detail"; appointment: Appointment };

// ── Component ──────────────────────────────────────────────────────

interface AgendaPageProps {
  user: { role?: string | null };
}

export function AgendaPage({ user }: AgendaPageProps) {
  const role = user.role ?? "ba";
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [dialog, setDialog] = useState<DialogState>(null);
  const [statusUpdate, setStatusUpdate] = useState("");

  const from = weekStart.toISOString();
  const to = addDays(weekStart, 7).toISOString();

  const { data: appointments = [], isLoading } = useAppointmentCalendar(from, to);
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  function handleCreate(data: AppointmentFormData) {
    createAppointment.mutate(
      {
        ...data,
        scheduledAt: new Date(data.scheduledAt),
        durationMinutes: data.durationMinutes,
      },
      { onSuccess: () => setDialog(null) },
    );
  }

  function handleStatusChange() {
    if (dialog?.mode !== "detail" || !statusUpdate) return;
    updateAppointment.mutate(
      {
        id: dialog.appointment.id,
        status: statusUpdate as any,
        ...(statusUpdate === "rescheduled" ? {} : {}),
      },
      { onSuccess: () => setDialog(null) },
    );
  }

  const isPending = createAppointment.isPending || updateAppointment.isPending;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Agenda"
        description="Citas y servicios programados"
        action={
          can(role, "appointment.create") ? (
            <Button onClick={() => setDialog({ mode: "create" })}>
              Nueva cita
            </Button>
          ) : undefined
        }
      />

      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            ← Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            Siguiente →
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekStart(getMonday(new Date()))}
          >
            Hoy
          </Button>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {formatDateRange(weekStart)}
        </span>
      </div>

      {/* Calendar */}
      {isLoading ? (
        <div className="grid h-[300px] grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-card p-2">
              <div className="h-4 w-8 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <WeekCalendar
          appointments={appointments}
          weekStart={weekStart}
          onAppointmentClick={(appt) => {
            setStatusUpdate(appt.status);
            setDialog({ mode: "detail", appointment: appt });
          }}
        />
      )}

      {/* Create Dialog */}
      <Dialog
        open={dialog?.mode === "create"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Nueva cita</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <AppointmentForm
              onSubmit={handleCreate}
              isPending={isPending}
            />
          </DialogBody>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" form="appointment-form" disabled={isPending}>
              {isPending ? "Creando..." : "Crear cita"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={dialog?.mode === "detail"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle de cita</DialogTitle>
          </DialogHeader>
          {dialog?.mode === "detail" && (
            <DialogBody>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tipo</dt>
                  <dd>
                    <Badge variant="secondary">
                      {EVENT_LABEL[dialog.appointment.eventType] ??
                        dialog.appointment.eventType}
                    </Badge>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Fecha</dt>
                  <dd className="font-medium">
                    {new Date(dialog.appointment.scheduledAt).toLocaleDateString(
                      "es-MX",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Duración</dt>
                  <dd>{dialog.appointment.durationMinutes} min</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estado actual</dt>
                  <dd>
                    <Badge
                      variant={
                        STATUS_VARIANT[dialog.appointment.status] ?? "secondary"
                      }
                    >
                      {STATUS_LABEL[dialog.appointment.status] ??
                        dialog.appointment.status}
                    </Badge>
                  </dd>
                </div>
                {dialog.appointment.comments && (
                  <div>
                    <dt className="mb-1 text-muted-foreground">Comentarios</dt>
                    <dd>{dialog.appointment.comments}</dd>
                  </div>
                )}
                {dialog.appointment.isVirtual && dialog.appointment.videoLink && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Video</dt>
                    <dd>
                      <a
                        href={dialog.appointment.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline"
                      >
                        Unirse
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              {/* Status change */}
              {can(role, "appointment.edit") && (
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  <Label className="text-xs text-muted-foreground">
                    Cambiar estado
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={statusUpdate}
                      onValueChange={(v) => setStatusUpdate(v ?? "")}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {APPOINTMENT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_LABEL[s] ?? s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      disabled={
                        isPending ||
                        statusUpdate === dialog.appointment.status
                      }
                      onClick={handleStatusChange}
                    >
                      {isPending ? "Guardando..." : "Actualizar"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogBody>
          )}
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Label imported from ui but need a simple one for inline use
function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`text-sm font-medium ${className ?? ""}`}>{children}</span>
  );
}
