import { Code2, Pencil } from "lucide-react";
import Link from "next/link";
import { PublishToggle } from "@/components/dashboard/PublishToggle";
import { RowMenu } from "@/components/dashboard/RowMenu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CalculatorSummary } from "@/lib/dashboard-data";

export function CalculatorsTable({ calculators }: { calculators: CalculatorSummary[] }) {
  if (calculators.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nie masz jeszcze żadnego kalkulatora.
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface/60 hover:bg-surface/60">
            <TableHead>Kalkulator</TableHead>
            <TableHead className="hidden md:table-cell">Odsłony</TableHead>
            <TableHead className="hidden md:table-cell">Leady</TableHead>
            <TableHead className="hidden lg:table-cell">Konwersja</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculators.map((calc) => (
            <TableRow key={calc.id}>
              <TableCell>
                <Link
                  href={`/dashboard/calculators/${calc.id}`}
                  className="font-medium text-foreground hover:text-brand"
                >
                  {calc.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {calc.industry} · {calc.questionCount} {calc.questionCount === 1 ? "pytanie" : "pytań"}
                </p>
              </TableCell>
              <TableCell className="hidden font-mono text-sm md:table-cell">{calc.views}</TableCell>
              <TableCell className="hidden font-mono text-sm md:table-cell">{calc.leads}</TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge variant="secondary" className="font-mono">
                  {calc.conversion.toFixed(1)}%
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <PublishToggle calculatorId={calc.id} isPublished={calc.isPublished} />
                  <span className="text-xs text-muted-foreground">{calc.isPublished ? "Aktywny" : "Wstrzymany"}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/embed?calculator=${calc.id}`}>
                      <Code2 className="size-4" /> Kod
                    </Link>
                  </Button>
                  <Button asChild variant="soft" size="sm">
                    <Link href={`/dashboard/calculators/${calc.id}`}>
                      <Pencil className="size-3.5" /> Edytuj
                    </Link>
                  </Button>
                  <RowMenu calculatorId={calc.id} calculatorName={calc.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
