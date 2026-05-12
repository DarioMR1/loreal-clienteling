import React, { useState } from "react";

import { SplitView } from "@/components/layout/split-view";
import { EmptyState } from "@/components/ui/empty-state";
import { ClientList } from "@/features/client-book/client-list";
import { ClientProfile } from "@/features/client-book/client-profile";
import type { Customer } from "@/types";

export default function ClientBookScreen() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  return (
    <SplitView
      master={
        <ClientList
          selectedId={selectedCustomer?.id ?? null}
          onSelect={setSelectedCustomer}
        />
      }
      detail={
        selectedCustomer ? (
          <ClientProfile customer={selectedCustomer} />
        ) : (
          <EmptyState
            icon="person"
            title="Selecciona un cliente"
            message="Elige un cliente de la lista para ver su perfil completo"
          />
        )
      }
    />
  );
}
