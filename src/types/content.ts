export type DaySchedule = { start: string; end: string };
export type WorkingHours = Partial<Record<number, DaySchedule | null>>;

export type ServiceRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  price_walkin: number | null;
  duration_minutes: number;
  active: boolean;
  available_days: number[] | null;
};

export type BarberRow = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  whatsapp_number: string;
  instagram_handle: string | null;
  photo_url: string | null;
  active: boolean;
  working_hours: WorkingHours;
};

export type GalleryRow = {
  id: string;
  image_url: string;
  label: string;
};

export type ProductRow = {
  id: string;
  name: string;
  price: number;
  active: boolean;
};

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
