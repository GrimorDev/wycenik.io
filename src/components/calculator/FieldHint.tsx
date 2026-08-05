"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function FieldHint({ children }: { children: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="text-muted-foreground hover:text-foreground">
          <Info className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-60">{children}</TooltipContent>
    </Tooltip>
  );
}
