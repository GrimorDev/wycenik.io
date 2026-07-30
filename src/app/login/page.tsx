"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (signInError) {
      setError("Nieprawidłowy e-mail lub hasło.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 font-display text-xl italic">
        Wycenik<span className="text-rust not-italic">.io</span>
      </Link>

      <form onSubmit={handleSubmit} className="ticket w-full max-w-sm p-8">
        <h1 className="font-display text-2xl">Zaloguj się</h1>
        <p className="mb-6 mt-1 text-sm text-ink-soft">Wejdź do panelu swoich kalkulatorów.</p>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field mt-1"
          />
        </label>

        {error && <p className="mb-4 text-sm text-rust-dark">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5">
          {loading ? "Logowanie…" : "Zaloguj się"}
        </button>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Nie masz konta?{" "}
          <Link href="/signup" className="link-underline font-medium text-ink">
            Zarejestruj się
          </Link>
        </p>
      </form>
    </div>
  );
}
