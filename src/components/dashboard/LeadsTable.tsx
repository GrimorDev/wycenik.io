"use client";

import { useState } from "react";
import { LeadDetailSheet } from "@/components/dashboard/LeadDetailSheet";
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
import type { CalculatorConfig } from "@/lib/calculator/types";

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  estimated_min: number;
  estimated_max: number;
  created_at: string;
  calculatorId: string;
  calculatorName: string;
  answers: Record<string, unknown>;
}

export function LeadsTable({
  leads,
  hasQuery,
  configsById,
}: {
  leads: LeadRow[];
  hasQuery: boolean;
  configsById: Record<string, CalculatorConfig>;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = leads.find((l) => l.id === activeId) ?? null;

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {hasQuery ? "Brak wyników dla tego wyszukiwania." : "Brak leadów jeszcze."}
      </div>
    );
  }

  return (
    <>
      <div className="panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/60 hover:bg-surface/60">
              <TableHead>Kontakt</TableHead>
              <TableHead className="hidden md:table-cell">Telefon</TableHead>
              <TableHead className="hidden lg:table-cell">Kalkulator</TableHead>
              <TableHead>Kwota</TableHead>
              <TableHead className="hidden sm:table-cell">Data</TableHead>
              <TableHead className="text-right">Szczegóły</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="cursor-pointer" onClick={() => setActiveId(lead.id)}>
                <TableCell>
                  <p className="font-medium text-foreground">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </TableCell>
                <TableCell className="hidden font-mono text-sm md:table-cell">{lead.phone ?? "—"}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="secondary" className="font-normal">
                    {lead.calculatorName}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono font-medium text-brand">
                  {lead.estimated_min}–{lead.estimated_max} zł
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {new Date(lead.created_at).toLocaleString("pl-PL")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(lead.id);
                    }}
                  >
                    Otwórz
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LeadDetailSheet
        lead={active}
        config={active ? configsById[active.calculatorId] : undefined}
        onClose={() => setActiveId(null)}
      />
    </>
  );
}
