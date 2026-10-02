"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Container from "./Container";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const PUBLIC_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/services" },
  { label: "Barber Kami", href: "/barbers" },
  { label: "Produk", href: "/products" },
  { label: "Galeri", href: "/gallery" },
  { label: "Tentang", href: "/about" },
  { label: "Lokasi", href: "/location" },
  { label: "Kontak", href: "/contact" },
];

const ADMIN_LINKS = [
  { label: "Overview", href: "/admin" },
  { label: "Booking", href: "/admin/bookings" },
  { label: "Barber", href: "/admin/barbers" },
  { label: "Layanan", href: "/admin/services" },
  { label: "Produk", href: "/admin/products" },
  { label: "Customer", href: "/admin/customers" },
  { label: "Galeri", href: "/admin/gallery" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith("/admin");

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadUserAndRole(userId: string | undefined, email: string | undefined) {
      setUserEmail(email ?? null);
      if (!userId) {
        setUserRole(null);
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
      setUserRole(profile?.role ?? null);
    }

    supabase.auth.getUser().then(({ data }) => {
      loadUserAndRole(data.user?.id, data.user?.email);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserAndRole(session?.user?.id, session?.user?.email);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Di area admin, navbar tidak pernah masuk mode "floating pill" —
  // supaya selalu flat dan konsisten dengan sidebar admin di bawahnya.
  const isFloating = scrolled && !open && !isAdminArea;

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const dashboardHref = userRole === "admin" ? "/admin" : userRole === "barber" ? "/barber-dashboard" : "/dashboard";

  const navLinks = isAdminArea ? ADMIN_LINKS : PUBLIC_LINKS;

  return (
    <>
      <div className="h-16" />

      <motion.header
        initial={false}
        animate={{
          top: isFloating ? 16 : 0,
          left: isFloating ? "50%" : "0%",
          x: isFloating ? "-50%" : "0%",
          width: isFloating ? "min(960px, 92vw)" : "100%",
          borderRadius: isFloating ? 999 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("fixed z-50 overflow-hidden", isFloating ? "border border-cream/10 bg-ink/70 text-cream shadow-xl shadow-ink/20 backdrop-blur-lg" : "border-b border-mist bg-cream/60 text-ink backdrop-blur-lg")}
      >
        <div className={cn("flex h-16 items-center justify-between gap-4 transition-all duration-300", isFloating ? "px-5" : "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8")}>
          <Link href={isAdminArea ? "/admin" : "/"} className={cn("shrink-0 text-lg font-extrabold tracking-tight transition-colors", isFloating ? "text-cream" : "text-ink")}>
            LUXCUT<span className="text-primary">LABZ</span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={cn("whitespace-nowrap text-sm font-medium transition-colors hover:text-primary", isFloating ? "text-cream/80" : "text-ink/80")}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {isAdminArea ? (
              <>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Admin</span>
                <button onClick={handleLogout} className="text-sm font-medium text-ink/60 hover:text-primary">
                  Keluar
                </button>
              </>
            ) : userEmail ? (
              <>
                <Button href={dashboardHref} variant="ghost" size="sm" className={isFloating ? "text-cream hover:bg-cream/10" : ""}>
                  {userRole === "admin" ? "Admin" : "Dashboard"}
                </Button>
                <button onClick={handleLogout} className={cn("text-sm font-medium hover:text-primary", isFloating ? "text-cream/60" : "text-ink/60")}>
                  Keluar
                </button>
              </>
            ) : (
              <Button href="/login" variant="ghost" size="sm" className={isFloating ? "text-cream hover:bg-cream/10" : ""}>
                Masuk
              </Button>
            )}
            {!isAdminArea && (
              <Button href="/booking" size="sm">
                Booking Sekarang
              </Button>
            )}
          </div>

          <button className={cn("shrink-0 lg:hidden", isFloating ? "text-cream" : "text-ink")} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((prev) => !prev)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-mist bg-cream/95 backdrop-blur-lg lg:hidden">
            <Container className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-mist">
                  {link.label}
                </Link>
              ))}

              {isAdminArea ? (
                <>
                  <span className="mb-1 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Masuk sebagai Admin</span>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="rounded-lg px-3 py-3 text-left text-base font-medium text-ink/60 hover:bg-mist"
                  >
                    Keluar
                  </button>
                </>
              ) : userEmail ? (
                <>
                  <Link href={dashboardHref} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-mist">
                    {userRole === "admin" ? "Admin" : "Dashboard"}
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="rounded-lg px-3 py-3 text-left text-base font-medium text-ink/60 hover:bg-mist"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-mist">
                  Masuk
                </Link>
              )}

              {!isAdminArea && (
                <Button href="/booking" className="mt-2 w-full">
                  Booking Sekarang
                </Button>
              )}
            </Container>
          </div>
        )}
      </motion.header>
    </>
  );
}
