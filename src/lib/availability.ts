import type { BarberRow, ServiceRow } from "@/types/content";

export type BookedSlot = { time: string; durationMinutes: number };

const SLOT_INTERVAL_MINUTES = 30;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function getAvailableSlots({ date, barber, service, bookedSlots = [] }: { date: Date; barber: BarberRow; service: ServiceRow; bookedSlots?: BookedSlot[] }): string[] {
  const dayOfWeek = date.getDay();
  const schedule = barber.working_hours[dayOfWeek];

  if (!schedule) return []; // barber libur hari itu

  const startMinutes = timeToMinutes(schedule.start);
  const endMinutes = timeToMinutes(schedule.end);
  const duration = service.duration_minutes;

  const isToday = new Date().toDateString() === date.toDateString();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: string[] = [];

  for (let slotStart = startMinutes; slotStart + duration <= endMinutes; slotStart += SLOT_INTERVAL_MINUTES) {
    const slotEnd = slotStart + duration;

    if (isToday && slotStart <= nowMinutes) continue;

    const overlaps = bookedSlots.some((booked) => {
      const bookedStart = timeToMinutes(booked.time);
      const bookedEnd = bookedStart + booked.durationMinutes;
      return slotStart < bookedEnd && bookedStart < slotEnd;
    });

    if (!overlaps) slots.push(minutesToTime(slotStart));
  }

  return slots;
}
