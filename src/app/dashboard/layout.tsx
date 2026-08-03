import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { getPlanUsage } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const usage = await getPlanUsage(supabase, user.id);

  return (
    <div className="font-dashboard flex min-h-screen flex-1 flex-col bg-slate-50 md:flex-row">
      <DashboardSidebar email={user.email ?? ""} usage={usage} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
