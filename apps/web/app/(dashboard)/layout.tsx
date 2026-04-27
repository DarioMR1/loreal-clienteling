import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect(ROUTES.SIGN_IN);
  }

  if (!session.user.active) {
    redirect(ROUTES.SIGN_IN);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar user={session.user} />

      <div className="flex flex-1 flex-col overflow-hidden bg-muted/40">
        <DashboardHeader user={session.user} />
        <main className="flex-1 overflow-y-auto overscroll-contain p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
