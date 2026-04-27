import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Iniciar Sesión | L'Oréal Clienteling",
};

export default function SignInPage() {
  return (
    <div className="space-y-8">
      {/* Header — Zen: clean hierarchy, generous spacing */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bienvenido de vuelta
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder al panel
        </p>
      </div>

      {/* Subtle divider — Zen: single deliberate line */}
      <div className="h-px bg-border/60" />

      {/* Form */}
      <SignInForm />

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
        >
          Crear usuario
        </Link>
      </p>
    </div>
  );
}
