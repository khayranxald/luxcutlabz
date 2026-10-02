import { z } from "zod";

export const bookingCustomerSchema = z.object({
  customerName: z.string().trim().min(2, "Nama minimal 2 karakter").max(100, "Nama terlalu panjang"),
  customerPhone: z
    .string()
    .trim()
    .regex(/^(08|\+?62)[0-9]{8,13}$/, "Format nomor WhatsApp tidak valid (contoh: 08123456789)"),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2, "Nama layanan minimal 2 karakter"),
  description: z.string().trim().max(500, "Deskripsi maksimal 500 karakter"),
  price: z.coerce.number().int().positive("Harga harus lebih dari 0"),
  duration_minutes: z.coerce.number().int().min(5, "Durasi minimal 5 menit"),
});

export const barberSchema = z.object({
  name: z.string().trim().min(2, "Nama barber minimal 2 karakter"),
  specialty: z.string().trim().max(100),
  bio: z.string().trim().max(500),
  whatsapp_number: z
    .string()
    .trim()
    .regex(/^62[0-9]{9,13}$/, "Gunakan format 62xxxxxxxxxx tanpa + atau 0 di depan"),
});
