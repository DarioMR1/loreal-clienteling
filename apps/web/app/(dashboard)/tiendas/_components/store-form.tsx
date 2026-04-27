"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateStore, STORE_CHAINS } from "@loreal/contracts";
import { createStoreSchema } from "@/lib/schemas/stores";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { Zone } from "@/lib/hooks";

const CHAIN_LABELS: Record<string, string> = {
  liverpool: "Liverpool",
  palacio: "Palacio de Hierro",
  owned: "Boutique propia",
};

interface StoreFormProps {
  defaultValues?: Partial<CreateStore>;
  zones: Zone[];
  onSubmit: (data: CreateStore) => void;
  isPending: boolean;
}

export function StoreForm({ defaultValues, zones, onSubmit, isPending }: StoreFormProps) {
  const form = useForm<CreateStore>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      code: defaultValues?.code ?? "",
      displayName: defaultValues?.displayName ?? "",
      chain: defaultValues?.chain ?? STORE_CHAINS[0],
      zoneId: defaultValues?.zoneId ?? "",
      address: defaultValues?.address ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "",
    },
  });

  function handleSubmit(data: CreateStore) {
    onSubmit({
      ...data,
      zoneId: data.zoneId || undefined,
      address: data.address || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
    });
  }

  return (
    <Form {...form}>
      <form id="store-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="LIV_POLANCO" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Liverpool Polanco" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="chain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cadena</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={isPending}>
                      <SelectValue placeholder="Seleccionar cadena">
                        {field.value ? CHAIN_LABELS[field.value] ?? field.value : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STORE_CHAINS.map((chain) => (
                      <SelectItem key={chain} value={chain}>
                        {CHAIN_LABELS[chain] ?? chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zoneId"
            render={({ field }) => {
              const zoneMap = Object.fromEntries(zones.map((z) => [z.id, z.displayName]));
              return (
                <FormItem>
                  <FormLabel>Zona</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger disabled={isPending}>
                        <SelectValue placeholder="Seleccionar zona">
                          {field.value ? zoneMap[field.value] ?? field.value : "Sin zona"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Sin zona</SelectItem>
                      {zones.map((z) => (
                        <SelectItem key={z.id} value={z.id}>
                          {z.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Av. Molière 222" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="Ciudad de México" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="CDMX" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
