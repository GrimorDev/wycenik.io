import Link from "next/link";
import { redirect } from "next/navigation";
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
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/dashboard" className="font-display text-lg font-semibold">
            Wycenik<span className="text-rust">.io</span>
          </Link>
          <nav className="flex items-center gap-4">
            <span className="tabular text-sm text-ink-faint">{user.email}</span>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col px-6 py-10">{children}</main>
    </div>
  );
}
