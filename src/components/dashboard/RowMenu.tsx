"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCalculator } from "@/lib/actions/calculators";

export function RowMenu({ calculatorId, calculatorName }: { calculatorId: string; calculatorName: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Więcej akcji">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={(e) => {
            e.preventDefault();
            if (confirm(`Usunąć kalkulator „${calculatorName}”? Tej operacji nie można cofnąć.`)) {
              deleteCalculator(calculatorId);
            }
          }}
        >
          <Trash2 className="size-4" /> Usuń kalkulator
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
