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
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl border border-black/10 p-8 text-center dark:border-white/10">
          <h1 className="mb-2 text-2xl font-semibold">Sprawdź swoją skrzynkę</h1>
          <p className="text-sm text-zinc-500">
            Wysłaliśmy link potwierdzający na adres <strong>{email}</strong>. Kliknij go, aby dokończyć rejestrację.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-black/10 p-8 dark:border-white/10"
      >
        <h1 className="mb-1 text-2xl font-semibold">Załóż konto</h1>
        <p className="mb-6 text-sm text-zinc-500">
          7 dni za darmo, bez karty płatniczej.
        </p>

        <label className="mb-4 block text-sm">
          Nazwa firmy
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </label>

        <label className="mb-4 block text-sm">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </label>

        <label className="mb-4 block text-sm">
          Hasło
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          />
        </label>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {loading ? "Tworzenie konta…" : "Załóż konto"}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Masz już konto?{" "}
          <Link href="/login" className="font-medium text-foreground underline">
            Zaloguj się
          </Link>
        </p>
      </form>
    </div>
  );
}
