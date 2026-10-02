export type DaySchedule = { start: string; end: string };
export type WorkingHours = Partial<Record<number, DaySchedule>>;

export type Barber = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  whatsappNumber: string;
  active: boolean;
  workingHours: WorkingHours;
};

const REGULAR_HOURS: WorkingHours = {
  1: { start: "10:00", end: "21:00" }, // Senin
  2: { start: "10:00", end: "21:00" }, // Selasa
  3: { start: "10:00", end: "21:00" }, // Rabu
  4: { start: "10:00", end: "21:00" }, // Kamis
  5: { start: "10:00", end: "21:00" }, // Jumat
  6: { start: "09:00", end: "22:00" }, // Sabtu
  0: { start: "10:00", end: "18:00" }, // Minggu
};

export const barbers: Barber[] = [
  {
    id: "barber-a",
    name: "Rizal",
    specialty: "Fades & Modern Cuts",
    bio: "5 tahun pengalaman, spesialis skin fade dan potongan bertekstur.",
    whatsappNumber: "6281234567890",
    active: true,
    workingHours: { ...REGULAR_HOURS, 1: undefined }, // libur Senin
  },
  {
    id: "barber-b",
    name: "Fahri",
    specialty: "Classic & Beard Styling",
    bio: "Barber presisi, dikenal lewat potongan klasik dan bentukan jenggot rapi.",
    whatsappNumber: "6281234567891",
    active: true,
    workingHours: { ...REGULAR_HOURS, 2: undefined }, // libur Selasa
  },
  {
    id: "barber-c",
    name: "Aldo",
    specialty: "Creative Design & Coloring",
    bio: "Suka bereksperimen dengan tekstur, pola, dan warna rambut.",
    whatsappNumber: "6281234567892",
    active: true,
    workingHours: { ...REGULAR_HOURS, 3: undefined }, // libur Rabu
  },
];
