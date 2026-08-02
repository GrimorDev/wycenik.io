import Link from "next/link";
import { CheckCircleIcon } from "@/components/icons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const FEATURES = [
  "Nielimitowana liczba kalkulatorów",
  "Nielimitowane leady i eksport CSV",
  "Widget poniżej 30 KB, bez limitu wyświetleń",
  "Personalizacja kolorów, kształtu i języka widgetu",
  "Powiadomienia e-mail o nowych leadach",
  "7 dni za darmo, bez podawania karty",
];

const FAQ = [
  {
    q: "Czy muszę podać kartę płatniczą, żeby zacząć?",
    a: "Nie. Rejestracja i 7-dniowy okres próbny nie wymagają karty płatniczej.",
  },
  {
    q: "Czy mogę zrezygnować w dowolnym momencie?",
    a: "Tak, subskrypcję można anulować w każdej chwili, bez okresu wypowiedzenia.",
  },
  {
    q: "Ile kalkulatorów mogę stworzyć?",
    a: "Plan nie ma limitu liczby kalkulatorów ani liczby zebranych leadów.",
  },
  {
    q: "Na jakich stronach zadziała widget?",
    a: "Wszędzie, gdzie można wkleić fragment <script> — WordPress, Webflow, Wix, Shopify, czysty HTML.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
        <div className="text-center">
          <p className="stamp text-rust">Cennik</p>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Jeden plan, bez niespodzianek
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">
            Wszystkie funkcje od pierwszego dnia. Bez ukrytych limitów, bez osobnych pakietów.
          </p>
        </div>

        <div className="ticket mt-14 p-8 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <p className="stamp text-rust">7 dni za darmo</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="tabular font-display text-6xl font-semibold">99</span>
              <span className="text-xl text-ink-soft">PLN / miesiąc</span>
            </p>
            <p className="mt-2 text-sm text-ink-faint">Płatność po zakończeniu okresu próbnego</p>

            <Link href="/signup" className="btn btn-primary mt-8 px-8 py-3 text-base">
              Zacznij za darmo
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-3 border-t border-dashed border-line-strong pt-8 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20">
          <h2 className="font-display text-2xl">Najczęstsze pytania</h2>
          <dl className="mt-6 space-y-6">
            {FAQ.map((item) => (
              <div key={item.q} className="border-t border-dashed border-line-strong pt-6">
                <dt className="font-display text-base">{item.q}</dt>
                <dd className="mt-1.5 text-sm text-ink-soft">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
