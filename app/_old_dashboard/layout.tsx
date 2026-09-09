import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-brand-gray">
        <DashboardSidebar />
        {/* Main content area */}
        <div className="lg:ps-64">
          <main className="pt-16 lg:pt-0 min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
