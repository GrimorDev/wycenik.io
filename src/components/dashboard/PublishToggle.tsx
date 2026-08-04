"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { togglePublish } from "@/lib/actions/calculators";

export function PublishToggle({ calculatorId, isPublished }: { calculatorId: string; isPublished: boolean }) {
  const [pending, startTransition] = useTransition();

  function handleChange(checked: boolean) {
    startTransition(() => {
      togglePublish(calculatorId, checked);
    });
  }

  return (
    <Switch
      checked={isPublished}
      onCheckedChange={handleChange}
      disabled={pending}
      aria-label={isPublished ? "Cofnij publikację" : "Opublikuj"}
    />
  );
}
