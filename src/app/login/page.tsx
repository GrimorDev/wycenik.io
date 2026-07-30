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
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-black/10 p-8 dark:border-white/10"
      >
        <h1 className="mb-1 text-2xl font-semibold">Zaloguj się</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Wejdź do panelu swoich kalkulatorów.
        </p>

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
          {loading ? "Logowanie…" : "Zaloguj się"}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Nie masz konta?{" "}
          <Link href="/signup" className="font-medium text-foreground underline">
            Zarejestruj się
          </Link>
        </p>
      </form>
    </div>
  );
}
