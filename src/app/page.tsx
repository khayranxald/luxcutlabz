import Link from "next/link";
import { Scissors, Users, MessageCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getActiveServices, getActiveBarbers } from "@/lib/content";
import { formatPrice } from "@/types/content";

export default async function Home() {
  const services = await getActiveServices();
  const barbers = await getActiveBarbers();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-28 sm:py-36">
        <video autoPlay muted loop playsInline poster="/videos/hero-poster.jpg" className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/cukur.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/70" />

        <Container className="relative z-10">
          <AnimatedSection className="max-w-2xl">
            <p className="mb-3 font-semibold text-primary">Stay Sharp. Stay Lux.</p>
            <h1 className="text-4xl text-cream sm:text-5xl lg:text-6xl">Pengalaman barbershop modern, dibuat untuk kamu.</h1>
            <p className="mt-4 text-cream/80">Potongan premium, barber berpengalaman, dan alur booking yang menyesuaikan jadwalmu — online atau langsung lewat WhatsApp.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/booking">Booking Sekarang</Button>
              <Button href="/services" variant="outline" className="border-cream text-cream hover:bg-cream hover:text-ink">
                Lihat Layanan
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* HIGHLIGHTS */}
      <section className="border-y border-mist bg-mist/40 py-16">
        <Container className="grid gap-8 sm:grid-cols-3">
          {[
            { icon: Scissors, title: "Barber Berpengalaman", desc: "Berpengalaman, spesialis, kualitas konsisten." },
            { icon: Users, title: "Booking Fleksibel", desc: "Pilih barber, tanggal, dan jam — tanpa perlu akun." },
            { icon: MessageCircle, title: "Siap via WhatsApp", desc: "Lebih suka chat? Langsung hubungi barber pilihanmu." },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <item.icon className="text-primary" size={28} />
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              <p className="text-sm text-ink/70">{item.desc}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Layanan" title="Dibuat untuk setiap gaya" description="Sekilas layanan kami — lihat daftar lengkap dan harganya." />
          <AnimatedSection className="mt-10 grid gap-6 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.id} className="rounded-2xl border border-mist bg-white p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-ink">{service.name}</h3>
                  <span className="whitespace-nowrap font-semibold text-primary">{formatPrice(service.price)}</span>
                </div>
                <p className="mt-2 text-sm text-ink/70">{service.description}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-ink/40">{service.duration_minutes} menit</p>
              </div>
            ))}
          </AnimatedSection>
          <div className="mt-8">
            <Button href="/services" variant="outline">
              Lihat Semua Layanan
            </Button>
          </div>
        </Container>
      </section>

      {/* BARBERS PREVIEW */}
      <section className="bg-ink py-20 text-cream">
        <Container>
          <SectionHeading eyebrow="Barber Kami" title="Kenalan dengan tim kami" description="Setiap barber punya keahlian masing-masing." className="[&_h2]:text-cream [&_p:last-child]:text-cream/70" />
          <AnimatedSection className="mt-10 grid gap-6 sm:grid-cols-2">
            {barbers.map((barber) => (
              <div key={barber.id} className="rounded-2xl border border-cream/10 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">{barber.name.charAt(0)}</div>
                <h3 className="mt-4 text-lg font-semibold">{barber.name}</h3>
                <p className="text-sm text-primary">{barber.specialty}</p>
                {barber.instagram_handle && <p className="text-xs text-cream/40">@{barber.instagram_handle}</p>}
                <p className="mt-2 text-sm text-cream/60">{barber.bio}</p>
              </div>
            ))}
          </AnimatedSection>
          <div className="mt-8">
            <Button href="/barbers" variant="outline" className="border-cream text-cream hover:bg-cream hover:text-ink">
              Lihat Semua Barber
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl text-ink sm:text-4xl">Siap untuk potongan berikutnya?</h2>
          <p className="max-w-md text-ink/70">Booking online kurang dari semenit, atau chat langsung lewat WhatsApp.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Button href="/booking">Booking Sekarang</Button>
            <Button href="/contact" variant="outline">
              Hubungi Kami
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
