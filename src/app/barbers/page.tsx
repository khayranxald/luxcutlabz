import Image from "next/image";
import { MessageCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getActiveBarbers } from "@/lib/content";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = { title: "Barber Kami — LUXCUTLABZ Barbershop" };

function buildWhatsAppLink(number: string) {
  const message = encodeURIComponent("Halo Kak, saya ingin booking di LUXCUTLABZ. Apakah slot hari ini masih tersedia?");
  return `https://wa.me/${number}?text=${message}`;
}

export default async function BarbersPage() {
  const barbers = await getActiveBarbers();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Barber Kami" title="Pilih yang memotong gayamu" description="Booking online, atau chat langsung dengan barber pilihanmu di WhatsApp." />
        <AnimatedSection className="mt-10 grid gap-6 sm:grid-cols-2">
          {barbers.map((barber) => (
            <div key={barber.id} className="flex flex-col rounded-2xl border border-mist bg-white p-6">
              {barber.photo_url ? (
                <Image src={barber.photo_url} alt={barber.name} width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">{barber.name.charAt(0)}</div>
              )}
              <h3 className="mt-4 text-lg font-semibold text-ink">{barber.name}</h3>
              <p className="text-sm text-primary">{barber.specialty}</p>
              {barber.instagram_handle && <p className="text-xs text-ink/50">@{barber.instagram_handle}</p>}
              <p className="mt-2 flex-1 text-sm text-ink/70">{barber.bio}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/booking" size="sm">
                  Booking
                </Button>
                <Button href={buildWhatsAppLink(barber.whatsapp_number)} variant="outline" size="sm" className="gap-1.5">
                  <MessageCircle size={16} />
                  WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </AnimatedSection>
      </Container>
    </section>
  );
}
