import { getSession } from "@/lib/auth";
import { DashboardPage } from "./_components/dashboard-page";

export default async function Page() {
  const session = await getSession();
  return <DashboardPage user={session?.user ?? {}} />;
}
