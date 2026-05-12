import React, { useCallback, useState } from "react";

import { SplitView } from "@/components/layout/split-view";
import { EmptyState } from "@/components/ui/empty-state";
import { AppointmentList } from "@/features/appointments/appointment-list";
import { AppointmentDetail } from "@/features/appointments/appointment-detail";
import type { Appointment } from "@/types";

export default function AppointmentsScreen() {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setSelectedAppointment(null);
  }, []);

  return (
    <SplitView
      master={
        <AppointmentList
          key={refreshKey}
          selectedId={selectedAppointment?.id ?? null}
          onSelect={setSelectedAppointment}
        />
      }
      detail={
        selectedAppointment ? (
          <AppointmentDetail
            appointment={selectedAppointment}
            onUpdate={handleUpdate}
          />
        ) : (
          <EmptyState
            icon="calendar"
            title="Selecciona una cita"
            message="Elige una cita de la lista para ver los detalles"
          />
        )
      }
    />
  );
}
