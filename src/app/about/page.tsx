import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "About — LUXCUTLABZ Barbershop",
};

export default function AboutPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Tentang Kami" title="Lebih dari sekadar potong rambut" />
        <div className="mt-6 space-y-4 text-ink/70">
          <p>LUXCUTLABZ dibangun dari ide sederhana: setiap potongan harus terasa punya tujuan. Kami memadukan teknik modern dengan ruang yang tenang dan premium — tanpa terburu-buru, tanpa kompromi.</p>
          <p>Barber kami dilatih untuk mendengarkan dulu, baru memotong. Mau fade tajam atau gaya klasik yang rapi, setiap kunjungan kami sesuaikan dengan kamu.</p>
        </div>
      </Container>
    </section>
  );
}
