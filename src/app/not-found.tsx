import Link from "next/link";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="flex flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">404</p>
        <h1 className="mt-2 text-3xl text-ink sm:text-4xl">Halaman tidak ditemukan</h1>
        <p className="mt-3 max-w-md text-ink/70">Halaman yang kamu cari sudah dipindahkan atau tidak pernah ada.</p>
        <Button href="/" className="mt-8">
          Kembali ke Beranda
        </Button>
      </Container>
    </section>
  );
}
