import Link from "next/link";
import { DemoWidgetEmbed } from "@/components/DemoWidgetEmbed";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const FEATURES = [
  {
    n: "01",
    title: "Kreator bez kodu",
    description: "Od 3 do 7 pytań: suwak, wybór jednokrotny, checkboxy. Zero programowania.",
  },
  {
    n: "02",
    title: "Widget poniżej 30 KB",
    description: "Jeden tag <script> na WordPressie, Webflow, Wix lub czystym HTML.",
  },
  {
    n: "03",
    title: "Gated lead capture",
    description: "Wycena pojawia się dopiero po podaniu imienia, e-maila i telefonu.",
  },
  {
    n: "04",
    title: "Powiadomienia i CSV",
    description: "Automatyczny e-mail do Ciebie i klienta, lista leadów do pobrania.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Stwórz pytania",
    description: "Dodaj od 3 do 7 pytań w kreatorze, ustaw cenę bazową i dopłaty za opcje.",
  },
  {
    n: "02",
    title: "Wklej kod",
    description: "Skopiuj gotowy fragment <script> i wklej go w edytorze swojej strony.",
  },
  {
    n: "03",
    title: "Zbieraj leady",
    description: "Klient widzi szacunkową wycenę, Ty od razu dostajesz jego dane kontaktowe.",
  },
];

const INDUSTRIES = [
  "Sprzątanie",
  "Wykończenia wnętrz",
  "Tworzenie stron WWW",
  "Remonty i budowa",
  "Ogrodnictwo",
  "Fotografia",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="stamp text-rust">Generator kalkulatorów wycen</p>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Kalkulator wyceny
              <br />
              na Twojej stronie
              <br />
              <span className="text-rust">w 5 minut</span>
            </h1>

            <p className="mt-6 max-w-md text-lg text-ink-soft">
              Klienci widzą szacunkową wycenę natychmiast, Ty zbierasz gotowe leady zamiast
              pustych zapytań &bdquo;ile to będzie kosztować?&rdquo;.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/signup" className="btn btn-primary px-7 py-3 text-base">
                Zacznij za darmo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a href="#demo" className="btn btn-ghost px-7 py-3 text-base">
                Zobacz demo
                <ChevronDownIcon className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 flex items-baseline gap-3 border-t border-dashed border-line-strong pt-6">
              <span className="tabular font-display text-4xl font-semibold text-rust">
                +30 do 40%
              </span>
              <span className="max-w-[14rem] text-sm text-ink-soft">
                więcej zapytań ofertowych po wdrożeniu kalkulatora
              </span>
            </div>

            <dl id="funkcje" className="mt-14 grid scroll-mt-24 grid-cols-1 gap-4 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div key={feature.n} className="ticket-dashed p-4">
                  <dt className="flex items-baseline gap-2 font-display text-base font-medium">
                    <span className="tabular text-sm text-ink-faint">{feature.n}</span>
                    {feature.title}
                  </dt>
                  <dd className="mt-1 text-sm text-ink-soft">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div id="demo" className="lg:sticky lg:top-24">
            <p className="mb-4 flex items-center gap-2 text-sm text-ink-soft">
              <ArrowRightIcon className="h-4 w-4 text-rust" />
              Przykładowy kalkulator, spróbuj:
            </p>
            <div className="ticket ticket-perforated p-6">
              <DemoWidgetEmbed slug="sprzatanie-demo" />
            </div>
            <p className="tabular mt-3 text-center text-xs text-ink-faint">
              wycenik.io/kalkulator/sprzatanie-demo
            </p>
          </div>
        </div>

        <section id="jak-to-dziala" className="mt-28 scroll-mt-24">
          <h2 className="font-display text-3xl">Jak to działa</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="ticket p-6">
                <span className="tabular font-display text-3xl text-rust">{step.n}</span>
                <p className="mt-3 font-display text-lg">{step.title}</p>
                <p className="mt-1.5 text-sm text-ink-soft">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-28">
          <h2 className="font-display text-3xl">Dla jakich branż</h2>
          <p className="mt-2 max-w-md text-ink-soft">
            Sprawdza się wszędzie tam, gdzie cena zależy od kilku prostych parametrów.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {INDUSTRIES.map((industry) => (
              <span
                key={industry}
                className="ticket-dashed px-4 py-2 font-display text-sm"
              >
                {industry}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-28 text-center">
          <div className="ticket mx-auto max-w-lg p-10">
            <p className="font-display text-2xl">Gotowy na więcej zapytań?</p>
            <p className="mt-2 text-sm text-ink-soft">
              7 dni za darmo, bez karty płatniczej.
            </p>
            <Link href="/signup" className="btn btn-primary mt-6 px-7 py-3 text-base">
              Zacznij za darmo
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
