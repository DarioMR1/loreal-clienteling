import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

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
    <div className="flex min-h-screen">
      {/* Sidebar — placeholder for future implementation */}
      <aside className="hidden w-64 border-r bg-card md:block">
        <div className="border-b p-4 font-semibold">L&apos;Oréal Clienteling</div>
        <nav className="p-4 text-sm text-muted-foreground">
          <p>Panel en construcción</p>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b px-6">
          <span className="text-sm text-muted-foreground">
            {session.user.fullName} — {session.user.role}
          </span>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
