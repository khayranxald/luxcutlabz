import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Lokasi — LUXCUTLABZ Barbershop",
};

const HOURS = [{ day: "Setiap Hari", time: "16:00 – 23:00" }];

export default function LocationPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-10 sm:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Lokasi" title="Kunjungi Barber kami" />
          <p className="mt-4 text-ink/70">Jl. Bambu Runcing, Parepare, Sulawesi Selatan, Indonesia</p>

          <h3 className="mt-8 text-lg font-semibold text-ink">Jam Operasional</h3>
          <ul className="mt-3 space-y-2">
            {HOURS.map((h) => (
              <li key={h.day} className="flex justify-between text-sm text-ink/70">
                <span>{h.day}</span>
                <span className="font-medium text-ink">{h.time}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs text-ink/50">Home Service tersedia khusus hari Rabu — lihat halaman Layanan untuk detail.</p>
        </div>

        <div className="aspect-video overflow-hidden rounded-2xl border border-mist">
          <iframe
            title="Lokasi LUXCUTLABZ Barbershop"
            src="https://www.google.com/maps?q=Jl.+Bambu+Runcing,+Parepare,+Sulawesi+Selatan&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </section>
  );
}
