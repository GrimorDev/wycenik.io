"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function LeadsSearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          if (e.target.value) params.set("q", e.target.value);
          else params.delete("q");
          router.replace(`/dashboard/leads?${params.toString()}`);
        }}
        placeholder="Szukaj po nazwisku, e-mailu…"
        className="w-64 pl-9"
      />
    </div>
  );
}
