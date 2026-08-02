import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-dashed border-line-strong px-6 py-8 text-sm text-ink-faint">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Wycenik.io</span>
        <nav className="flex items-center gap-5">
          <Link href="/#funkcje" className="hover:text-ink-soft">
            Funkcje
          </Link>
          <Link href="/cennik" className="hover:text-ink-soft">
            Cennik
          </Link>
          <Link href="/login" className="hover:text-ink-soft">
            Zaloguj się
          </Link>
        </nav>
      </div>
    </footer>
  );
}
