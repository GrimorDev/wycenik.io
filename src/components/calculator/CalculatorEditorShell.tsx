import type { ReactNode } from "react";
import { CalculatorHeader } from "@/components/calculator/CalculatorHeader";
import { CalculatorTabs } from "@/components/calculator/CalculatorTabs";

interface Props {
  calculatorId: string;
  name: string;
  slug: string;
  isPublished: boolean;
  questionCount?: number;
  preview?: ReactNode;
  children: ReactNode;
}

export function CalculatorEditorShell({
  calculatorId,
  name,
  slug,
  isPublished,
  questionCount,
  preview,
  children,
}: Props) {
  return (
    <div className="flex flex-col lg:h-screen lg:overflow-hidden">
      <CalculatorHeader
        calculatorId={calculatorId}
        name={name}
        slug={slug}
        isPublished={isPublished}
        questionCount={questionCount}
      />
      <div className="border-b border-border bg-background px-6 py-3 md:px-10">
        <CalculatorTabs calculatorId={calculatorId} />
      </div>

      {preview ? (
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:overflow-hidden">
          <div className="px-6 py-6 md:px-10 lg:overflow-y-auto">{children}</div>
          {preview}
        </div>
      ) : (
        <div className="flex-1 px-6 py-6 md:px-10 lg:overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </div>
      )}
    </div>
  );
}
