"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { getAvailableSlots } from "@/lib/availability";
import { getPrayerTimes } from "@/lib/prayerTimes";
import { bookingCustomerSchema } from "@/lib/validation";
import type { Booking } from "@/types/booking";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/types/content";
import type { ServiceRow, BarberRow } from "@/types/content";

const STEPS = ["Layanan", "Barber", "Tanggal", "Jam", "Data Diri", "Konfirmasi"];
const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function toISODate(date: Date) {
  return date.toISOString().split("T")[0];
}

function nextNDays(n: number): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function generateBookingCode(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LCZ-${random}`;
}

function getPrayerLabel(slot: string, prayerTimes: { maghrib: string; isya: string } | null): string | null {
  if (!prayerTimes) return null;

  const [slotH, slotM] = slot.split(":").map(Number);
  const slotMinutes = slotH * 60 + slotM;

  const [maghribH, maghribM] = prayerTimes.maghrib.split(":").map(Number);
  const maghribMinutes = maghribH * 60 + maghribM;

  const [isyaH, isyaM] = prayerTimes.isya.split(":").map(Number);
  const isyaMinutes = isyaH * 60 + isyaM;

  if (slotMinutes >= maghribMinutes - 30 && slotMinutes <= maghribMinutes) return "Mendekati Maghrib";
  if (slotMinutes >= isyaMinutes - 30 && slotMinutes <= isyaMinutes) return "Mendekati Isya";

  return null;
}

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [booking, setBooking] = useState<Booking | null>(null);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [barbers, setBarbers] = useState<BarberRow[]>([]);
  const [bookedSlots, setBookedSlots] = useState<{ time: string; durationMinutes: number }[]>([]);
  const [prayerTimes, setPrayerTimes] = useState<{ maghrib: string; isya: string } | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .then(({ data, error }) => {
        if (error) {
          console.error("Gagal mengambil layanan:", error);
          setServices([]);
          return;
        }

        setServices(data ?? []);
      });

    supabase
      .from("barbers")
      .select("*")
      .eq("active", true)
      .then(({ data, error }) => {
        if (error) {
          console.error("Gagal mengambil barber:", error);
          setBarbers([]);
          return;
        }

        setBarbers(data ?? []);
      });
  }, []);

  const service = services.find((s) => s.id === serviceId) ?? null;
  const barber = barbers.find((b) => b.id === barberId) ?? null;
  const dates = useMemo(() => nextNDays(14), []);

  useEffect(() => {
    if (!barber || !dateISO || !service) {
      setBookedSlots([]);
      return;
    }
    const supabase = createClient();

    supabase.rpc("get_booked_times", { p_barber_id: barber.id, p_date: dateISO }).then(({ data, error }) => {
      if (error) {
        console.error("Gagal mengambil booking:", error);
        setBookedSlots([]);
        return;
      }

      setBookedSlots(
        (data ?? []).map((row: { booked_time: string }) => ({
          time: row.booked_time,
          durationMinutes: service.duration_minutes,
        })),
      );
    });
  }, [barber, dateISO, service]);

  useEffect(() => {
    if (!dateISO) {
      setPrayerTimes(null);
      return;
    }
    getPrayerTimes(dateISO).then(setPrayerTimes);
  }, [dateISO]);

  const availableSlots = useMemo(() => {
    if (!service || !barber || !dateISO) return [];
    const date = new Date(dateISO + "T00:00:00");

    return getAvailableSlots({
      date,
      barber,
      service,
      bookedSlots,
    });
  }, [service, barber, dateISO, bookedSlots]);

  async function handleConfirm() {
    if (honeypot) return;
    if (!service || !barber || !dateISO || !time) return;

    const result = bookingCustomerSchema.safeParse({ customerName, customerPhone });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const supabase = createClient();

    const { data: userData } = await supabase.auth.getUser();

    const code = generateBookingCode();

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        code,
        service_id: service.id,
        barber_id: barber.id,
        customer_id: userData.user?.id ?? null,
        customer_name: customerName,
        customer_phone: customerPhone,
        date: dateISO,
        time,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      alert("Gagal membuat booking: " + error.message);
      return;
    }

  setBooking({
    id: data.id,
    code: data.code,
    serviceId: data.service_id,
    barberId: data.barber_id,
    date: data.date,
    time: data.time,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    notes: data.notes,
    status: data.status,
    createdAt: data.created_at,
  });

    setStep(5);
  }

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading eyebrow="Booking" title="Booking Janji Temu" />

        <div className="mt-8 flex flex-wrap gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium", i === step && "bg-primary text-cream", i < step && "bg-mist text-ink/60", i > step && "bg-mist/50 text-ink/30")}>
              {i < step ? <Check size={12} /> : <span>{i + 1}</span>}
              {label}
            </div>
          ))}
        </div>

        <div className="mt-8">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setServiceId(s.id);
                    setStep(1);
                  }}
                  className={cn("rounded-2xl border p-5 text-left transition-colors", serviceId === s.id ? "border-primary bg-primary/5" : "border-mist bg-white hover:border-primary/50")}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{s.name}</span>
                    <span className="text-sm font-semibold text-primary">{formatPrice(s.price)}</span>
                  </div>
                  {s.price_walkin && <p className="text-xs text-ink/40">Walk-in: {formatPrice(s.price_walkin)}</p>}
                  <p className="mt-1 text-xs text-ink/50">{s.duration_minutes} menit</p>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {barbers
                .filter((b) => b.active)
                .map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBarberId(b.id);
                      setStep(2);
                    }}
                    className={cn("rounded-2xl border p-5 text-left transition-colors", barberId === b.id ? "border-primary bg-primary/5" : "border-mist bg-white hover:border-primary/50")}
                  >
                    <span className="font-semibold text-ink">{b.name}</span>
                    <p className="mt-1 text-xs text-primary">{b.specialty}</p>
                  </button>
                ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {dates
                .filter((d) => !service?.available_days || service.available_days.includes(d.getDay()))
                .map((d) => {
                  const iso = toISODate(d);

                  return (
                    <button
                      key={iso}
                      onClick={() => {
                        setDateISO(iso);
                        setTime(null);
                        setStep(3);
                      }}
                      className={cn("flex flex-col items-center rounded-xl border p-3 text-sm transition-colors", dateISO === iso ? "border-primary bg-primary/5" : "border-mist bg-white hover:border-primary/50")}
                    >
                      <span className="text-xs text-ink/50">{DAY_LABELS[d.getDay()]}</span>

                      <span className="mt-1 font-semibold text-ink">{d.getDate()}</span>
                    </button>
                  );
                })}
            </div>
          )}

          {step === 3 && (
            <div>
              {availableSlots.length === 0 ? (
                <p className="rounded-xl bg-mist/50 p-4 text-sm text-ink/60">Barber tidak tersedia pada tanggal ini. Silakan pilih tanggal lain.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {availableSlots.map((slot) => {
                    const prayerLabel = getPrayerLabel(slot, prayerTimes);
                    return (
                      <button
                        key={slot}
                        onClick={() => {
                          setTime(slot);
                          setStep(4);
                        }}
                        className={cn(
                          "flex flex-col items-center rounded-xl border py-2.5 text-sm font-medium transition-colors",
                          time === slot ? "border-primary bg-primary/5 text-primary" : "border-mist bg-white text-ink hover:border-primary/50",
                        )}
                      >
                        <span>{slot}</span>
                        {prayerLabel && <span className="mt-0.5 text-[10px] font-normal text-ink/40">{prayerLabel}</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              <button onClick={() => setStep(2)} className="mt-4 text-sm text-ink/60 underline underline-offset-2">
                Ganti tanggal
              </button>
            </div>
          )}

          {step === 4 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              className="space-y-4"
            >
              <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                  Nama Lengkap
                </label>

                <input
                  id="name"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-primary"
                />
                {formErrors.customerName && <p className="mt-1 text-xs text-red-600">{formErrors.customerName}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
                  Nomor WhatsApp
                </label>

                <input
                  id="phone"
                  required
                  type="tel"
                  inputMode="numeric"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-primary"
                />
                {formErrors.customerPhone && <p className="mt-1 text-xs text-red-600">{formErrors.customerPhone}</p>}
              </div>

              <div>
                <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-ink">
                  Catatan <span className="font-normal text-ink/40">(opsional)</span>
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: potong pendek di bagian samping, alergi produk tertentu, dll."
                  rows={3}
                  maxLength={300}
                  className="w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-primary"
                />
              </div>

              <div className="rounded-xl bg-mist/50 p-4 text-sm text-ink/70">
                <p>
                  <span className="font-medium text-ink">Layanan:</span> {service?.name}
                </p>

                <p>
                  <span className="font-medium text-ink">Barber:</span> {barber?.name}
                </p>

                <p>
                  <span className="font-medium text-ink">Tanggal:</span> {dateISO}
                </p>

                <p>
                  <span className="font-medium text-ink">Jam:</span> {time}
                </p>

                {notes.trim() && (
                  <p>
                    <span className="font-medium text-ink">Catatan:</span> {notes}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Konfirmasi Booking
              </Button>
            </form>
          )}

          {step === 5 && booking && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-cream">
                <Check size={28} />
              </div>

              <h3 className="mt-4 text-xl font-semibold text-ink">Booking Berhasil!</h3>

              <p className="mt-1 text-sm text-ink/60">Simpan kode booking ini sebagai bukti.</p>

              <p className="mt-4 text-3xl font-extrabold tracking-wider text-primary">{booking.code}</p>

              <div className="mt-6 space-y-1 text-left text-sm text-ink/70">
                <p>
                  <span className="font-medium text-ink">Layanan:</span> {service?.name}
                </p>

                <p>
                  <span className="font-medium text-ink">Barber:</span> {barber?.name}
                </p>

                <p>
                  <span className="font-medium text-ink">Tanggal:</span> {booking.date}
                </p>

                <p>
                  <span className="font-medium text-ink">Jam:</span> {booking.time}
                </p>

                {booking.notes && (
                  <p>
                    <span className="font-medium text-ink">Catatan:</span> {booking.notes}
                  </p>
                )}

                <p>
                  <span className="font-medium text-ink">Status:</span> Menunggu konfirmasi
                </p>
              </div>

              <Button href="/" className="mt-8 w-full">
                Kembali ke Beranda
              </Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
