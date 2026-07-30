import Link from "next/link";
import { DemoWidgetEmbed } from "@/components/DemoWidgetEmbed";

const FEATURES = [
  {
    title: "Kreator bez kodu",
    description: "3–7 pytań: suwak, wybór jednokrotny, checkboxy. Zero programowania.",
  },
  {
    title: "Widget poniżej 30 KB",
    description: "Jeden tag <script> na WordPressie, Webflow, Wix lub czystym HTML.",
  },
  {
    title: "Gated lead capture",
    description: "Wycena pojawia się dopiero po podaniu imienia, e-maila i telefonu.",
  },
  {
    title: "Powiadomienia i CSV",
    description: "Automatyczny e-mail do Ciebie i klienta, lista leadów do pobrania.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
        <span className="font-semibold">Wycenik.io</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-zinc-500 hover:text-foreground">
            Zaloguj się
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-foreground px-4 py-2 font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Załóż konto
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Kalkulator wyceny na Twojej stronie w 5 minut
            </h1>
            <p className="mt-4 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
              Zwiększ liczbę zapytań nawet o 30–40%. Klienci widzą szacunkową wycenę
              natychmiast, Ty zbierasz gotowe leady.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Zacznij za darmo
              </Link>
              <a
                href="#demo"
                className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
              >
                Zobacz demo
              </a>
            </div>

            <dl className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div key={feature.title}>
                  <dt className="font-medium">{feature.title}</dt>
                  <dd className="mt-1 text-sm text-zinc-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div id="demo" className="lg:sticky lg:top-16">
            <p className="mb-3 text-sm font-medium text-zinc-500">
              Przykładowy kalkulator — spróbuj:
            </p>
            <DemoWidgetEmbed slug="sprzatanie-demo" />
          </div>
        </div>
      </main>

      <footer className="border-t border-black/10 px-6 py-6 text-center text-sm text-zinc-500 dark:border-white/10">
        © {new Date().getFullYear()} Wycenik.io
      </footer>
    </div>
  );
}
