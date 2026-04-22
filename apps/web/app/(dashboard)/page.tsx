import { getSession } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Bienvenido, {session?.user?.fullName}
      </h1>
      <div className="rounded-lg border p-4 space-y-2">
        <p>
          <strong>Correo:</strong> {session?.user?.email}
        </p>
        <p>
          <strong>Rol:</strong> {session?.user?.role}
        </p>
        <p>
          <strong>Tienda:</strong> {session?.user?.storeId ?? "N/A"}
        </p>
        <p>
          <strong>Marca:</strong> {session?.user?.brandId ?? "N/A"}
        </p>
        <p>
          <strong>Zona:</strong> {session?.user?.zoneId ?? "N/A"}
        </p>
      </div>
      <SignOutButton />
    </div>
  );
}
