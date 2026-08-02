import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line px-6 py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold">
          Wycenik<span className="text-rust">.io</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/#funkcje" className="hidden text-ink-soft hover:text-ink sm:inline">
            Funkcje
          </Link>
          <Link href="/#jak-to-dziala" className="hidden text-ink-soft hover:text-ink sm:inline">
            Jak to działa
          </Link>
          <Link href="/cennik" className="hidden text-ink-soft hover:text-ink sm:inline">
            Cennik
          </Link>
          <Link href="/login" className="link-underline text-ink-soft hover:text-ink">
            Zaloguj się
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Załóż konto
          </Link>
        </nav>
      </div>
    </header>
  );
}
