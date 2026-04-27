"use client";

import type { Appointment } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { AppointmentCard } from "./appointment-card";

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface WeekCalendarProps {
  appointments: Appointment[];
  weekStart: Date;
  onAppointmentClick: (appt: Appointment) => void;
}

export function WeekCalendar({
  appointments,
  weekStart,
  onAppointmentClick,
}: WeekCalendarProps) {
  // Generate 7 days starting from weekStart
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Group appointments by day
  function getAppointmentsForDay(day: Date): Appointment[] {
    const dayStr = day.toISOString().split("T")[0];
    return appointments
      .filter((a) => a.scheduledAt.startsWith(dayStr))
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() -
          new Date(b.scheduledAt).getTime(),
      );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border/50 bg-border/50">
      {days.map((day, i) => {
        const dayStr = day.toISOString().split("T")[0];
        const isToday = dayStr === today;
        const dayAppointments = getAppointmentsForDay(day);

        return (
          <div key={i} className="flex min-h-[200px] flex-col bg-card">
            {/* Day header */}
            <div
              className={cn(
                "border-b border-border/50 px-2 py-1.5 text-center text-xs",
                isToday
                  ? "bg-primary/5 font-semibold text-primary"
                  : "text-muted-foreground/60",
              )}
            >
              <div>{DAY_NAMES[i]}</div>
              <div
                className={`text-sm ${
                  isToday
                    ? "inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {day.getDate()}
              </div>
            </div>

            {/* Appointments */}
            <div className="flex-1 space-y-1 overflow-y-auto p-1">
              {dayAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onClick={() => onAppointmentClick(appt)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
