"use client";

import { GENDERS } from "@loreal/contracts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
}

const GENDER_LABELS: Record<string, string> = {
  female: "Femenino",
  male: "Masculino",
  non_binary: "No binario",
  prefer_not_say: "Prefiere no decir",
};

interface CustomerFormProps {
  defaultValues?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
  isPending: boolean;
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  isPending,
}: CustomerFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CustomerFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    };
    const email = formData.get("email") as string;
    if (email) data.email = email;
    const phone = formData.get("phone") as string;
    if (phone) data.phone = phone;
    const gender = formData.get("gender") as string;
    if (gender) data.gender = gender;
    const birthDate = formData.get("birthDate") as string;
    if (birthDate) data.birthDate = birthDate;
    onSubmit(data);
  }

  return (
    <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="María"
            defaultValue={defaultValues?.firstName}
            required
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="García"
            defaultValue={defaultValues?.lastName}
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="maria@ejemplo.com"
            defaultValue={defaultValues?.email}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="5512345678"
            defaultValue={defaultValues?.phone}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Género</Label>
          <Select
            defaultValue={defaultValues?.gender ?? ""}
            name="gender"
            disabled={isPending}
          >
            <SelectTrigger placeholder="Seleccionar" />
            <SelectContent>
              {GENDERS.map((g) => (
                <SelectItem key={g} value={g}>
                  {GENDER_LABELS[g] ?? g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={defaultValues?.birthDate?.split("T")[0]}
            disabled={isPending}
          />
        </div>
      </div>
    </form>
  );
}
