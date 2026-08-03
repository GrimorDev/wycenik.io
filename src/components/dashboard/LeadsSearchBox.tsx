"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/icons";

export function LeadsSearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="relative w-full max-w-xs">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          if (e.target.value) params.set("q", e.target.value);
          else params.delete("q");
          router.replace(`/dashboard/leads?${params.toString()}`);
        }}
        placeholder="Szukaj po nazwisku, e-mailu…"
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
      />
    </div>
  );
}
