import Link from "next/link";
import Container from "./Container";

const FOOTER_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Our Barbers", href: "/barbers" },
  { label: "Gallery", href: "/gallery" },
  { label: "Location", href: "/location" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-mist bg-ink text-cream">
      <Container className="grid gap-8 py-12 sm:grid-cols-2">
        <div>
          <p className="text-lg font-extrabold tracking-tight">
            LUXCUT<span className="text-primary">LABZ</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-cream/60">Stay Sharp. Stay Lux. Pengalaman barbershop modern.</p>
        </div>

        <nav className="flex flex-col gap-2 sm:items-end">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-cream/70 transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>

      <div className="border-t border-cream/10 py-4">
        <Container>
          <p className="text-xs text-cream/50">© {new Date().getFullYear()} LUXCUTLABZ Barbershop. Hak cipta dilindungi.</p>
        </Container>
      </div>
    </footer>
  );
}
