import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { TemplatesPage } from "./_components/templates-page";

export default async function PlantillasPage() {
  const session = await getSession();
  if (!session?.user) redirect(ROUTES.SIGN_IN);

  return <TemplatesPage user={session.user} />;
}
