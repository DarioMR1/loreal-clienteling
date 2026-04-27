"use client";

import { useState } from "react";
import { type Customer, useUpdateCustomer } from "@/lib/hooks";
import { can } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { CreateCustomer } from "@loreal/contracts";
import { CustomerForm } from "../../_components/customer-form";

const GENDER_LABELS: Record<string, string> = {
  female: "Femenino",
  male: "Masculino",
  non_binary: "No binario",
  prefer_not_say: "Prefiere no decir",
};

interface ProfileSectionProps {
  customer: Customer;
  role: string;
}

export function ProfileSection({ customer, role }: ProfileSectionProps) {
  const [editing, setEditing] = useState(false);
  const updateCustomer = useUpdateCustomer();

  function handleSubmit(data: CreateCustomer) {
    updateCustomer.mutate(
      {
        id: customer.id,
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
      { onSuccess: () => setEditing(false) },
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
          {can(role, "customer.edit") && (
            <CardAction>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                Editar
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <Field label="Nombre" value={`${customer.firstName} ${customer.lastName}`} />
            <Field label="Email" value={customer.email} />
            <Field label="Teléfono" value={customer.phone} />
            <Field label="Género" value={customer.gender ? GENDER_LABELS[customer.gender] ?? customer.gender : null} />
            <Field
              label="Fecha de nacimiento"
              value={
                customer.birthDate
                  ? new Date(customer.birthDate).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : null
              }
            />
            <Field
              label="Última transacción"
              value={
                customer.lastTransactionAt
                  ? new Date(customer.lastTransactionAt).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : null
              }
            />
          </dl>
        </CardContent>
      </Card>

      <Dialog open={editing} onOpenChange={(open) => !open && setEditing(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar clienta</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <CustomerForm
              defaultValues={{
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email ?? undefined,
                phone: customer.phone ?? undefined,
                gender: customer.gender ?? undefined,
                birthDate: customer.birthDate ?? undefined,
              }}
              onSubmit={handleSubmit}
              isPending={updateCustomer.isPending}
            />
          </DialogBody>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" disabled={updateCustomer.isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="customer-form"
              disabled={updateCustomer.isPending}
            >
              {updateCustomer.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value ?? "—"}</dd>
    </div>
  );
}
