"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { USER_ROLES } from "@loreal/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ROUTES } from "@/lib/constants";

const ROLE_LABELS: Record<string, string> = {
  ba: "Beauty Advisor",
  manager: "Gerente de Tienda",
  supervisor: "Supervisor de Zona",
  admin: "Administrador Central",
};

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ba",
  });

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.fullName,
      fullName: formData.fullName,
      role: formData.role,
    });

    if (authError) {
      setError(authError.message ?? "Error al crear usuario");
      setLoading(false);
      return;
    }

    router.push(ROUTES.DASHBOARD);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Ana García López"
          value={formData.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="usuario@loreal.mx"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          required
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Rol</Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => updateField("role", e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role] ?? role}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creando..." : "Crear Usuario"}
      </Button>
    </form>
  );
}
