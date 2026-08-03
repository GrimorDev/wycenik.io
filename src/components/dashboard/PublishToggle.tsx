"use client";

import { useTransition } from "react";
import { togglePublish } from "@/lib/actions/calculators";

export function PublishToggle({ calculatorId, isPublished }: { calculatorId: string; isPublished: boolean }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      togglePublish(calculatorId, !isPublished);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={isPublished}
      aria-label={isPublished ? "Cofnij publikację" : "Opublikuj"}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
        isPublished ? "bg-slate-900" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          isPublished ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
}
