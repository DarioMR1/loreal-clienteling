import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Crear Usuario | L'Oréal Clienteling",
};

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      {/* Header — Zen: clean hierarchy, generous spacing */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crear usuario
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra un nuevo usuario en el sistema
        </p>
      </div>

      {/* Subtle divider — Zen: single deliberate line */}
      <div className="h-px bg-border/60" />

      {/* Form */}
      <SignUpForm />

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
