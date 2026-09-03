import { getAdminUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
