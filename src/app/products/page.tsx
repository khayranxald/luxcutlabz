import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getActiveProducts } from "@/lib/content";
import { formatPrice } from "@/types/content";

export const metadata = { title: "Produk — LUXCUTLABZ Barbershop" };

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Produk" title="Produk perawatan rambut" description="Tersedia langsung di barbershop kami." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 && <p className="col-span-full text-sm text-ink/50">Belum ada produk tersedia.</p>}
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-2xl border border-mist bg-white p-5">
              <span className="font-medium text-ink">{p.name}</span>
              <span className="font-semibold text-primary">{formatPrice(p.price)}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
