"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <p className="font-semibold text-ink">Email terkirim!</p>
        <p className="mt-2 text-sm text-ink/60">Cek inbox {email} dan klik link di dalamnya untuk atur password baru.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Akun</p>
      <h1 className="mt-1 text-3xl font-bold text-ink">Lupa Password</h1>
      <p className="mt-2 text-sm text-ink/60">Masukkan email akun kamu, kami kirim link untuk atur password baru.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-primary" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </Button>

        <p className="text-center text-sm text-ink/60">
          <a href="/login" className="font-medium text-primary">
            Kembali ke login
          </a>
        </p>
      </form>
    </div>
  );
}
