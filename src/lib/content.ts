import { createClient } from "@/lib/supabase/server";
import type { ServiceRow, BarberRow, ProductRow } from "@/types/content";

export async function getActiveServices(): Promise<ServiceRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("active", true).order("price", { ascending: true });
  return data ?? [];
}

export async function getActiveBarbers(): Promise<BarberRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("barbers").select("*").eq("active", true).order("name", { ascending: true });
  return data ?? [];
}

export async function getActiveProducts(): Promise<ProductRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("active", true).order("name", { ascending: true });
  return data ?? [];
}
