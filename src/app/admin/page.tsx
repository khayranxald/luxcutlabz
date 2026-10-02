import SectionHeading from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: bookings } = await supabase.from("bookings").select("status, date");

  const stats = {
    today: (bookings ?? []).filter((b) => b.date === today).length,
    pending: (bookings ?? []).filter((b) => b.status === "pending").length,
    confirmed: (bookings ?? []).filter((b) => b.status === "confirmed").length,
    completed: (bookings ?? []).filter((b) => b.status === "completed").length,
    upcoming: (bookings ?? []).filter((b) => b.date >= today && b.status !== "cancelled").length,
  };

  const cards = [
    { label: "Booking Hari Ini", value: stats.today },
    { label: "Menunggu Konfirmasi", value: stats.pending },
    { label: "Dikonfirmasi", value: stats.confirmed },
    { label: "Selesai", value: stats.completed },
    { label: "Total Mendatang", value: stats.upcoming },
  ];

  return (
    <div>
      <SectionHeading eyebrow="Admin" title="Ringkasan" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-mist p-5">
            <p className="text-3xl font-extrabold text-primary">{c.value}</p>
            <p className="mt-1 text-sm text-ink/60">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
