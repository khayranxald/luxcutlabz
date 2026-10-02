import Link from "next/link";
import { Scissors } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* PANEL KIRI — brand, animasi, sembunyi di mobile */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-cream lg:flex">
        {/* Blob animasi */}
        <div aria-hidden className="animate-float-slow absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div aria-hidden className="animate-float-slower absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        {/* Garis dekoratif bergerak, nuansa "gunting memotong" */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
          <div className="animate-shimmer absolute top-1/3 h-px w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="animate-shimmer absolute top-2/3 h-px w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent [animation-delay:1.5s]" />
        </div>

        <Link href="/" className="relative z-10 text-lg font-extrabold tracking-tight">
          LUXCUT<span className="text-primary">LABZ</span>
        </Link>

        <div className="relative z-10 max-w-sm">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Scissors size={22} />
          </div>
          <h2 className="text-3xl font-bold leading-tight">
            Stay Sharp.
            <br />
            Stay Lux.
          </h2>
          <p className="mt-4 text-sm text-cream/60">Kelola booking kamu, lihat riwayat potongan, dan dapatkan slot favoritmu — semua dari satu akun.</p>
        </div>

        <p className="relative z-10 text-xs text-cream/40">© {new Date().getFullYear()} LUXCUTLABZ Barbershop</p>
      </div>

      {/* PANEL KANAN — form */}
      <div className="flex flex-col items-center justify-center bg-cream px-4 py-10">
        <Link href="/" className="mb-8 text-lg font-extrabold tracking-tight text-ink lg:hidden">
          LUXCUT<span className="text-primary">LABZ</span>
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
