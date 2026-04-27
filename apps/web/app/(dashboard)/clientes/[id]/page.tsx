import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { CustomerDetailPage } from "./_components/customer-detail-page";

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect(ROUTES.SIGN_IN);

  const { id } = await params;

  return <CustomerDetailPage customerId={id} user={session.user} />;
}
