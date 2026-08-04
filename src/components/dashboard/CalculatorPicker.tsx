"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option {
  id: string;
  name: string;
}

export function CalculatorPicker({ calculators, selectedId }: { calculators: Option[]; selectedId?: string }) {
  const router = useRouter();

  return (
    <Select value={selectedId ?? ""} onValueChange={(v) => router.push(`/dashboard/embed?calculator=${v}`)}>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Wybierz kalkulator" />
      </SelectTrigger>
      <SelectContent>
        {calculators.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
