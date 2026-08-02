import { redirect } from "next/navigation";
import { CompanyNameForm } from "@/components/account/CompanyNameForm";
import { PasswordChangeForm } from "@/components/account/PasswordChangeForm";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-12">
      <h1 className="font-display text-3xl">Ustawienia konta</h1>

      <section className="space-y-3">
        <h2 className="font-display text-xl">Firma</h2>
        <label className="block text-sm text-ink-soft">
          E-mail
          <input value={user.email ?? ""} disabled className="field mt-1 opacity-60" />
        </label>
        <CompanyNameForm companyName={profile?.company_name ?? null} />
      </section>

      <section className="space-y-3 border-t border-dashed border-line-strong pt-8">
        <h2 className="font-display text-xl">Hasło</h2>
        <PasswordChangeForm />
      </section>
    </div>
  );
}
