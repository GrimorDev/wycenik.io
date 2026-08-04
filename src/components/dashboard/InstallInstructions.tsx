import { CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GUIDES: Record<string, string[]> = {
  WordPress: [
    "Otwórz stronę lub wpis w edytorze bloków.",
    'Dodaj blok „Własny HTML".',
    "Wklej skopiowany kod i zapisz zmiany.",
  ],
  Webflow: [
    'Dodaj element „Embed" w miejscu, gdzie ma pojawić się kalkulator.',
    "Wklej skopiowany kod do okna embedu.",
    "Opublikuj stronę.",
  ],
  "Czysty HTML": [
    "Otwórz plik HTML swojej strony w edytorze.",
    "Wklej kod tuż przed zamykającym tagiem </body>.",
    "Zapisz i wgraj plik na serwer.",
  ],
};

export function InstallInstructions() {
  return (
    <div className="panel p-5">
      <h2 className="text-base font-semibold text-foreground">Instrukcja instalacji</h2>
      <Tabs defaultValue="WordPress" className="mt-4">
        <TabsList className="w-full">
          {Object.keys(GUIDES).map((k) => (
            <TabsTrigger key={k} value={k} className="flex-1">
              {k}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(GUIDES).map(([k, steps]) => (
          <TabsContent key={k} value={k} className="mt-4 space-y-3">
            {steps.map((s, i) => (
              <div key={s} className="flex gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-accent-foreground">
                  {i + 1}
                </span>
                <p className="text-muted-foreground">{s}</p>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6 flex items-start gap-2 rounded-lg bg-surface p-3 text-xs text-muted-foreground">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
        Widget ładuje się asynchronicznie i nie spowalnia strony. Zmiany w edytorze pojawiają się
        u klientów bez ponownego wklejania kodu.
      </div>
    </div>
  );
}
