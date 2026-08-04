import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { togglePublish } from "@/lib/actions/calculators";

interface Props {
  calculatorId: string;
  name: string;
  slug: string;
  isPublished: boolean;
  questionCount?: number;
}

export function CalculatorHeader({ calculatorId, name, slug, isPublished, questionCount }: Props) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/85 px-6 py-4 backdrop-blur md:px-10">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold text-foreground">{name}</h1>
        <p className="font-mono mt-0.5 text-sm text-muted-foreground">
          /{slug}
          {questionCount != null ? ` · ${questionCount} ${questionCount === 1 ? "pytanie" : "pytań"}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={isPublished ? "default" : "secondary"}>{isPublished ? "Aktywny" : "Szkic"}</Badge>
        <form action={togglePublish.bind(null, calculatorId, !isPublished)}>
          <Button type="submit" variant="brand">
            {isPublished ? "Cofnij publikację" : "Opublikuj"}
          </Button>
        </form>
      </div>
    </header>
  );
}
