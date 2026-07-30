"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setLoading(false);
      setError(
        signUpError.message.includes("already registered")
          ? "Konto z tym adresem e-mail już istnieje."
          : "Nie udało się utworzyć konta. Spróbuj ponownie.",
      );
      return;
    }

    if (data.user && companyName.trim()) {
      await supabase
        .from("profiles")
        .update({ company_name: companyName.trim() })
        .eq("id", data.user.id);
    }

    setLoading(false);

    if (!data.session) {
      // Email confirmation is required before a session exists.
      setNeedsConfirmation(true);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (needsConfirmation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <Link href="/" className="mb-8 font-display text-xl italic">
          Wycenik<span className="text-rust not-italic">.io</span>
        </Link>
        <div className="ticket w-full max-w-sm p-8 text-center">
          <p className="stamp text-rust">Prawie gotowe</p>
          <h1 className="mt-4 font-display text-2xl">Sprawdź swoją skrzynkę</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Wysłaliśmy link potwierdzający na adres <strong className="text-ink">{email}</strong>.
            Kliknij go, aby dokończyć rejestrację.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 font-display text-xl italic">
        Wycenik<span className="text-rust not-italic">.io</span>
      </Link>

      <form onSubmit={handleSubmit} className="ticket w-full max-w-sm p-8">
        <h1 className="font-display text-2xl">Załóż konto</h1>
        <p className="mb-6 mt-1 text-sm text-ink-soft">7 dni za darmo, bez karty płatniczej.</p>

        <label className="mb-4 block text-sm text-ink-soft">
          Nazwa firmy
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="field mt-1"
          />
        </label>

        <label className="mb-4 block text-sm text-ink-soft">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field mt-1"
          />
        </label>

        <label className="mb-5 block text-sm text-ink-soft">
          Hasło
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field mt-1"
          />
        </label>

        {error && <p className="mb-4 text-sm text-rust-dark">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5">
          {loading ? "Tworzenie konta…" : "Załóż konto"}
        </button>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Masz już konto?{" "}
          <Link href="/login" className="link-underline font-medium text-ink">
            Zaloguj się
          </Link>
        </p>
      </form>
    </div>
  );
}
