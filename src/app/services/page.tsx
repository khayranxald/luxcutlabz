import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getActiveServices } from "@/lib/content";
import { formatPrice } from "@/types/content";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = { title: "Layanan — LUXCUTLABZ Barbershop" };

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Layanan" title="Semua layanan, harga jelas" description="Harga dan durasi di sini selalu diperbarui." />
        <AnimatedSection className="mt-10 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col justify-between rounded-2xl border border-mist bg-white p-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-ink">{service.name}</h3>
                  <div className="text-right">
                    <p className="whitespace-nowrap font-semibold text-primary">
                      {formatPrice(service.price)} <span className="text-xs font-normal text-ink/40">booking</span>
                    </p>
                    {service.price_walkin && <p className="text-xs text-ink/50">{formatPrice(service.price_walkin)} jika datang langsung</p>}
                  </div>
                </div>
                <p className="mt-2 text-sm text-ink/70">{service.description}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-ink/40">{service.duration_minutes} menit</p>
              </div>
              <Button href="/booking" size="sm" className="mt-5 self-start">
                Booking Layanan Ini
              </Button>
            </div>
          ))}
        </AnimatedSection>
      </Container>
    </section>
  );
}
