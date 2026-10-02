"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

function dashboardPathForRole(role: string | undefined) {
  if (role === "admin") return "/admin";
  if (role === "barber") return "/barber-dashboard";
  return "/dashboard";
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setCheckingSession(false);
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();

      router.replace(dashboardPathForRole(profile?.role));
    });
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError("Email atau password salah.");
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();

    router.push(dashboardPathForRole(profile?.role));
    router.refresh();
  }

  if (checkingSession) {
    return <div className="py-10 text-center text-sm text-ink/50">Memuat...</div>;
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Akun</p>
      <h1 className="mt-1 text-3xl font-bold text-ink">Masuk ke Akun</h1>
      <p className="mt-2 text-sm text-ink/60">Selamat datang kembali di LUXCUTLABZ.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-primary" suppressHydrationWarning />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-primary" />
          <a href="/forgot-password" className="mt-1.5 inline-block text-xs font-medium text-primary">
            Lupa password?
          </a>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Memproses..." : "Masuk"}
        </Button>

        <p className="text-center text-sm text-ink/60">
          Belum punya akun?{" "}
          <a href="/register" className="font-medium text-primary">
            Daftar
          </a>
        </p>
      </form>
    </div>
  );
}
