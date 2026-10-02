"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase otomatis menangkap token dari URL dan membuat sesi sementara
    // "recovery" saat halaman ini dibuka dari link email.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Jaga-jaga kalau event sudah terlewat sebelum listener terpasang
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!ready) {
    return (
      <div className="text-center">
        <p className="text-sm text-ink/60">Memverifikasi link reset password... Kalau halaman ini tidak berubah dalam beberapa detik, link mungkin sudah kedaluwarsa — minta link baru dari halaman login.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <p className="font-semibold text-ink">Password berhasil diubah!</p>
        <p className="mt-2 text-sm text-ink/60">Mengarahkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Akun</p>
      <h1 className="mt-1 text-3xl font-bold text-ink">Atur Password Baru</h1>
      <p className="mt-2 text-sm text-ink/60">Masukkan password baru untuk akun kamu.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Password Baru</label>
          <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Konfirmasi Password</label>
          <input required type="password" minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-primary" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
        </Button>
      </form>
    </div>
  );
}
