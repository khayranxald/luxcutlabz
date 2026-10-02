import type { Booking } from "@/types/booking";

// Penyimpanan sementara di memori browser (hilang saat halaman di-reload).
// Ini demo untuk Week 3 — akan diganti ke Supabase saat database
// terhubung di tahap berikutnya, tanpa mengubah cara pemanggilannya
// dari halaman booking.
const bookings: Booking[] = [];

export function generateBookingCode(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LCZ-${random}`;
}

export function saveBooking(booking: Booking) {
  bookings.push(booking);
  return booking;
}

export function getBookingsForBarberOnDate(barberId: string, dateISO: string) {
  return bookings.filter((b) => b.barberId === barberId && b.date === dateISO);
}
