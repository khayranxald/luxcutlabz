"use client";

import { useEffect } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-24">
      <Container className="flex flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-600">Error</p>
        <h1 className="mt-2 text-3xl text-ink sm:text-4xl">Terjadi kesalahan</h1>
        <p className="mt-3 max-w-md text-ink/70">Maaf, ada sesuatu yang tidak berjalan semestinya. Coba muat ulang halaman.</p>
        <button onClick={reset} className="mt-8 rounded-full bg-primary px-6 py-2.5 font-semibold text-cream hover:bg-primary-dark">
          Coba Lagi
        </button>
      </Container>
    </section>
  );
}
