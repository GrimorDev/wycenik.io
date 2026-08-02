"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function PasswordChangeForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }
    if (password !== confirm) {
      setError("Hasła nie są identyczne.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Nie udało się zmienić hasła.");
      return;
    }

    setSuccess(true);
    setPassword("");
    setConfirm("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm text-ink-soft">
        Nowe hasło
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
          className="field mt-1"
        />
      </label>
      <label className="block text-sm text-ink-soft">
        Powtórz nowe hasło
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={6}
          required
          className="field mt-1"
        />
      </label>
      {error && <p className="text-sm text-rust-dark">{error}</p>}
      {success && <p className="text-sm text-sage">Hasło zmienione.</p>}
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Zapisywanie…" : "Zmień hasło"}
      </button>
    </form>
  );
}
