"use client";

import { useActionState } from "react";
import { updateCompanyName } from "@/lib/actions/account";
import type { ActionState } from "@/lib/actions/calculators";

const initialState: ActionState = { error: null };

export function CompanyNameForm({ companyName }: { companyName: string | null }) {
  const [state, formAction, pending] = useActionState(updateCompanyName, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm text-ink-soft">
        Nazwa firmy
        <input name="company_name" defaultValue={companyName ?? ""} className="field mt-1" />
      </label>
      {state.error && <p className="text-sm text-rust-dark">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Zapisywanie…" : "Zapisz"}
      </button>
    </form>
  );
}
