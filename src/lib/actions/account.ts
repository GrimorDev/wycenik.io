"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/actions/calculators";
import { createClient } from "@/lib/supabase/server";

export async function updateCompanyName(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const companyName = String(formData.get("company_name") ?? "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({ company_name: companyName || null })
    .eq("id", user.id);

  if (error) return { error: "Nie udało się zapisać zmian." };

  revalidatePath("/dashboard/account");
  return { error: null };
}
