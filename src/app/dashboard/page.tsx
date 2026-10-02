import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { services, formatPrice } from "@/data/services";
import { barbers } from "@/data/barbers";

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  confirmed: "Dikonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  no_show: "Tidak Hadir",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

  const { data: bookings } = await supabase.from("bookings").select("*").eq("customer_id", user.id).order("date", { ascending: false });

  const today = new Date().toISOString().split("T")[0];
  const upcoming = (bookings ?? []).filter((b) => b.date >= today && b.status !== "cancelled");
  const history = (bookings ?? []).filter((b) => b.date < today || b.status === "cancelled");

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Dashboard" title={`Halo, ${profile?.full_name ?? "Pelanggan"}`} description="Kelola booking kamu di sini." />

        <div className="mt-8">
          <Button href="/booking">Booking Baru</Button>
        </div>

        <h3 className="mt-10 text-lg font-semibold text-ink">Booking Mendatang</h3>
        <div className="mt-4 space-y-3">
          {upcoming.length === 0 && <p className="text-sm text-ink/50">Belum ada booking mendatang.</p>}
          {upcoming.map((b) => {
            const service = services.find((s) => s.id === b.service_id);
            const barber = barbers.find((br) => br.id === b.barber_id);
            return (
              <div key={b.id} className="rounded-2xl border border-mist bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-ink">{service?.name}</p>
                    <p className="text-sm text-ink/60">
                      {barber?.name} • {b.date} • {b.time}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{STATUS_LABEL[b.status]}</span>
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink/40">Kode: {b.code}</p>
              </div>
            );
          })}
        </div>

        <h3 className="mt-10 text-lg font-semibold text-ink">Riwayat Booking</h3>
        <div className="mt-4 space-y-3">
          {history.length === 0 && <p className="text-sm text-ink/50">Belum ada riwayat booking.</p>}
          {history.map((b) => {
            const service = services.find((s) => s.id === b.service_id);
            const barber = barbers.find((br) => br.id === b.barber_id);
            return (
              <div key={b.id} className="rounded-2xl border border-mist bg-white/60 p-5 opacity-70">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-ink">{service?.name}</p>
                    <p className="text-sm text-ink/60">
                      {barber?.name} • {b.date} • {b.time}
                    </p>
                  </div>
                  <span className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-ink/60">{STATUS_LABEL[b.status]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
