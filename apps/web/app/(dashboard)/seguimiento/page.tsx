import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { SeguimientoPage } from "./_components/seguimiento-page";

export default async function SeguimientoRoute() {
  const session = await getSession();
  if (!session?.user) redirect(ROUTES.SIGN_IN);

  return <SeguimientoPage user={session.user} />;
}
