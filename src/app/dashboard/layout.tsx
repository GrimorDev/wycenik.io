import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";
import { LogoutButton } from "@/components/LogoutButton";
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

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex flex-col gap-4 border-b border-line px-5 py-4 md:w-60 md:shrink-0 md:border-b-0 md:border-r md:py-6">
        <Link href="/dashboard" className="font-display text-lg font-semibold">
          Wycenik<span className="text-rust">.io</span>
        </Link>

        <DashboardNav />

        <div className="mt-auto border-t border-dashed border-line-strong pt-4">
          <p className="tabular truncate text-xs text-ink-faint">{user.email}</p>
          <div className="mt-1">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col px-6 py-10">{children}</main>
    </div>
  );
}
