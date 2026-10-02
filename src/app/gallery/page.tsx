import Image from "next/image";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/server";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = { title: "Galeri — LUXCUTLABZ Barbershop" };

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Galeri" title="Intip suasana LUXCUTLABZ" description="Dokumentasi hasil kerja dan suasana studio kami." />
        <AnimatedSection className="mt-10 grid gap-6 sm:grid-cols-2">
          {(items ?? []).length === 0 && <p className="col-span-full text-sm text-ink/50">Belum ada foto galeri.</p>}
          {(items ?? []).map((item) => (
            <div key={item.id} className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
              <Image src={item.image_url} alt={item.label} fill className="object-cover" />
            </div>
          ))}
        </AnimatedSection>
      </Container>
    </section>
  );
}
