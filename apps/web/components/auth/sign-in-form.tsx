"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Login } from "@loreal/contracts";
import { loginSchema } from "@/lib/schemas/users";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ROUTES } from "@/lib/constants";

// ── Demo quick-login accounts ────────────────────────────────────
const DEMO_ACCOUNTS = [
  { label: "Admin Central", email: "admin@loreal.mx", role: "admin" },
  { label: "Gerente · Lancôme", email: "a.martinez@loreal.mx", role: "manager" },
  { label: "Gerente · YSL", email: "l.diaz@loreal.mx", role: "manager" },
  { label: "Supervisor", email: "g.torres@loreal.mx", role: "supervisor" },
] as const;

const DEMO_PASSWORD = "Password123!";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleSubmit(data: Login) {
    setError(null);
    setLoading(true);

    const { error: authError } = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setError(authError.message ?? "Error al iniciar sesión");
      setLoading(false);
      return;
    }

    router.push(ROUTES.DASHBOARD);
    router.refresh();
  }

  async function handleDemoLogin(email: string) {
    setError(null);
    setLoadingDemo(email);

    const { error: authError } = await signIn.email({
      email,
      password: DEMO_PASSWORD,
    });

    if (authError) {
      setError(authError.message ?? "Error al iniciar sesión");
      setLoadingDemo(null);
      return;
    }

    router.push(ROUTES.DASHBOARD);
    router.refresh();
  }

  const isDisabled = loading || !!loadingDemo;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="usuario@loreal.mx"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button type="submit" className="w-full" size="lg" disabled={isDisabled}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </div>
      </form>

      {/* Demo quick-login */}
      <div className="pt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground">
              Acceso rápido demo
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDemoLogin(account.email)}
              className="flex flex-col items-start rounded-xl border border-border/60 px-3 py-2.5 text-left transition-colors hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="text-xs font-medium text-foreground">
                {loadingDemo === account.email ? "Ingresando..." : account.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {account.email}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Form>
  );
}
