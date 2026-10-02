import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/server";
import { services } from "@/data/services";

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  confirmed: "Dikonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  no_show: "Tidak Hadir",
};

export default async function BarberDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("full_name, role, barber_id").eq("id", user.id).single();

  if (!profile || profile.role !== "barber" || !profile.barber_id) {
    redirect("/dashboard");
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: bookings } = await supabase.from("bookings").select("*").eq("barber_id", profile.barber_id).neq("status", "cancelled").order("date", { ascending: true });

  const todayBookings = (bookings ?? []).filter((b) => b.date === today);
  const upcomingBookings = (bookings ?? []).filter((b) => b.date > today);

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Dashboard Barber" title={`Halo, ${profile.full_name}`} description="Berikut jadwal booking kamu." />

        <h3 className="mt-10 text-lg font-semibold text-ink">Booking Hari Ini</h3>
        <div className="mt-4 space-y-3">
          {todayBookings.length === 0 && <p className="text-sm text-ink/50">Tidak ada booking hari ini.</p>}
          {todayBookings.map((b) => {
            const service = services.find((s) => s.id === b.service_id);
            return (
              <div key={b.id} className="rounded-2xl border border-mist bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-ink">{b.customer_name}</p>
                    <p className="text-sm text-ink/60">
                      {service?.name} • {b.time}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{STATUS_LABEL[b.status]}</span>
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="mt-10 text-lg font-semibold text-ink">Booking Mendatang</h3>
        <div className="mt-4 space-y-3">
          {upcomingBookings.length === 0 && <p className="text-sm text-ink/50">Tidak ada booking mendatang.</p>}
          {upcomingBookings.map((b) => {
            const service = services.find((s) => s.id === b.service_id);
            return (
              <div key={b.id} className="rounded-2xl border border-mist bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-ink">{b.customer_name}</p>
                    <p className="text-sm text-ink/60">
                      {service?.name} • {b.date} • {b.time}
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
