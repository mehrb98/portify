import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth";
import { getNavCounts } from "@/lib/admin/queries";
import { db } from "@/lib/db";

// Every page below also calls requireAdmin(); the layout needs the email for the sidebar.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const email = await requireAdmin();
  const [counts, profile] = await Promise.all([getNavCounts(), db.profile.findUnique({ where: { id: 1 }, select: { name: true } })]);
  return (
    <AdminShell counts={counts} name={profile?.name ?? "Owner"} email={email}>
      {children}
    </AdminShell>
  );
}
