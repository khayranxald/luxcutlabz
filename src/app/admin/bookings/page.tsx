"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  no_show: "Tidak Hadir",
};

const STATUS_OPTIONS = ["all", "pending", "confirmed", "completed", "cancelled", "no_show"];

type BookingWithNames = {
  id: string;
  code: string;
  date: string;
  time: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  barber_id: string;
  service_id: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithNames[]>([]);
  const [barberNames, setBarberNames] = useState<Record<string, string>>({});
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [barberFilter, setBarberFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  async function loadData() {
    setLoading(true);
    const [{ data: bookingData }, { data: barbers }, { data: services }] = await Promise.all([
      supabase.from("bookings").select("*").order("date", { ascending: false }),
      supabase.from("barbers").select("id, name"),
      supabase.from("services").select("id, name"),
    ]);

    setBookings(bookingData ?? []);
    setBarberNames(Object.fromEntries((barbers ?? []).map((b) => [b.id, b.name])));
    setServiceNames(Object.fromEntries((services ?? []).map((s) => [s.id, s.name])));
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("bookings").update({ status }).eq("id", id);
    loadData();
  }

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (dateFilter && b.date !== dateFilter) return false;
    if (barberFilter !== "all" && b.barber_id !== barberFilter) return false;
    return true;
  });

  return (
    <div>
      <SectionHeading eyebrow="Admin" title="Kelola Booking" />

      <div className="mt-6 flex flex-wrap gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-mist px-3 py-2 text-sm">
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "Semua Status" : STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-xl border border-mist px-3 py-2 text-sm" />
        <select value={barberFilter} onChange={(e) => setBarberFilter(e.target.value)} className="rounded-xl border border-mist px-3 py-2 text-sm">
          <option value="all">Semua Barber</option>
          {Object.entries(barberNames).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-ink/50">Memuat...</p>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.length === 0 && <p className="text-sm text-ink/50">Tidak ada booking.</p>}
          {filtered.map((b) => (
            <div key={b.id} className="rounded-2xl border border-mist p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">
                    {b.customer_name} <span className="text-ink/40">• {b.code}</span>
                  </p>
                  <p className="text-sm text-ink/60">
                    {serviceNames[b.service_id]} • {barberNames[b.barber_id]} • {b.date} • {b.time}
                  </p>
                  <p className="text-xs text-ink/40">{b.customer_phone}</p>
                  {b.notes && <p className="mt-1 rounded-lg bg-mist/50 px-2 py-1 text-xs italic text-ink/60">&ldquo;{b.notes}&rdquo;</p>}
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    b.status === "pending" && "bg-yellow-100 text-yellow-700",
                    b.status === "confirmed" && "bg-primary/10 text-primary",
                    b.status === "completed" && "bg-blue-100 text-blue-700",
                    (b.status === "cancelled" || b.status === "no_show") && "bg-red-100 text-red-700",
                  )}
                >
                  {STATUS_LABEL[b.status]}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.status === "pending" && (
                  <button onClick={() => updateStatus(b.id, "confirmed")} className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-cream">
                    Konfirmasi
                  </button>
                )}
                {(b.status === "pending" || b.status === "confirmed") && (
                  <>
                    <button onClick={() => updateStatus(b.id, "completed")} className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-cream">
                      Selesai
                    </button>
                    <button onClick={() => updateStatus(b.id, "no_show")} className="rounded-full bg-mist px-3 py-1.5 text-xs font-medium text-ink">
                      Tidak Hadir
                    </button>
                    <button onClick={() => updateStatus(b.id, "cancelled")} className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600">
                      Batalkan
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
