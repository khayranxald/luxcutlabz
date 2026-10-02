import { MessageCircle, Mail, MapPin } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Kontak — LUXCUTLABZ Barbershop",
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-xl">
        <SectionHeading eyebrow="Kontak" title="Hubungi Kami" />
        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-3 text-ink/70">
            <MapPin className="text-primary" size={20} />
            <span>jl. bambu runcing | parepare</span>
          </div>
          <div className="flex items-center gap-3 text-ink/70">
            <Mail className="text-primary" size={20} />
            <span>hello@luxcutlabz.com</span>
          </div>
          <div className="flex items-center gap-3 text-ink/70">
            <MessageCircle className="text-primary" size={20} />
            <span>Chat langsung dengan kami di WhatsApp</span>
          </div>
        </div>
        <div className="mt-8">
          <Button href="https://wa.me/088994425371" className="gap-1.5">
            <MessageCircle size={18} />
            Chat di WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}
