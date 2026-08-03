import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { CalculatorTabs } from "./CalculatorTabs";

interface Props {
  calculatorId: string;
  name: string;
  slug: string;
  isPublished: boolean;
}

export function CalculatorHeader({ calculatorId, name, slug, isPublished }: Props) {
  return (
    <div>
      <Link href="/dashboard" className="link-underline flex items-center gap-1.5 text-sm text-ink-soft">
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Twoje kalkulatory
      </Link>
      <div className="mb-1 mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl">{name}</h1>
        <span className={`stamp ${isPublished ? "text-sage" : "text-ink-faint"}`}>
          {isPublished ? "Opublikowany" : "Szkic"}
        </span>
      </div>
      <p className="tabular text-sm text-ink-faint">/{slug}</p>
      <div className="mt-6">
        <CalculatorTabs calculatorId={calculatorId} />
      </div>
    </div>
  );
}
