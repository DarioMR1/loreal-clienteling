import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { CustomersPage } from "./_components/customers-page";

export default async function ClientesPage() {
  const session = await getSession();
  if (!session?.user) redirect(ROUTES.SIGN_IN);

  return <CustomersPage user={session.user} />;
}
