export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
};

export const services: Service[] = [
  {
    id: "haircut",
    name: "Haircut",
    description: "Classic or modern cut, tailored to your style and face shape.",
    price: 25000,
    durationMinutes: 45,
  },
  {
    id: "haircut-product",
    name: "Haircut + Product",
    description: "Full haircut finished with premium styling product.",
    price: 35000,
    durationMinutes: 60,
  },
  {
    id: "beard-trim",
    name: "Beard Trim & Shape",
    description: "Precision beard shaping with hot towel finish.",
    price: 20000,
    durationMinutes: 30,
  },
  {
    id: "haircut-beard",
    name: "Haircut + Beard",
    description: "Complete grooming package — hair and beard in one session.",
    price: 45000,
    durationMinutes: 75,
  },
];

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
