import Link from "next/link";
import { DemoWidgetEmbed } from "@/components/DemoWidgetEmbed";

const FEATURES = [
  {
    n: "01",
    title: "Kreator bez kodu",
    description: "3–7 pytań: suwak, wybór jednokrotny, checkboxy. Zero programowania.",
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

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-display text-xl italic">
            Wycenik<span className="text-rust not-italic">.io</span>
          </span>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/login" className="link-underline text-ink-soft hover:text-ink">
              Zaloguj się
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Załóż konto
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="stamp text-rust">Generator kalkulatorów wycen</p>

            <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Kalkulator wyceny
              <br />
              na Twojej stronie
              <br />
              <span className="text-rust italic">w 5 minut</span>
            </h1>

            <p className="mt-6 max-w-md text-lg text-ink-soft">
              Klienci widzą szacunkową wycenę natychmiast, Ty zbierasz gotowe
              leady zamiast pustych zapytań &bdquo;ile to będzie kosztować?&rdquo;.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/signup" className="btn btn-primary px-7 py-3 text-base">
                Zacznij za darmo
              </Link>
              <a href="#demo" className="btn btn-ghost px-7 py-3 text-base">
                Zobacz demo ↓
              </a>
            </div>

            <div className="mt-10 flex items-baseline gap-3 border-t border-dashed border-line-strong pt-6">
              <span className="tabular font-display text-4xl text-rust">+30–40%</span>
              <span className="max-w-[14rem] text-sm text-ink-soft">
                więcej zapytań ofertowych po wdrożeniu kalkulatora
              </span>
            </div>

            <dl className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <span className="tabular text-rust">→</span>
              Przykładowy kalkulator — spróbuj:
            </p>
            <div className="ticket ticket-perforated p-6">
              <DemoWidgetEmbed slug="sprzatanie-demo" />
            </div>
            <p className="tabular mt-3 text-center text-xs text-ink-faint">
              wycenik.io/kalkulator/sprzatanie-demo
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-dashed border-line-strong px-6 py-6 text-center text-sm text-ink-faint">
        © {new Date().getFullYear()} Wycenik.io
      </footer>
    </div>
  );
}
