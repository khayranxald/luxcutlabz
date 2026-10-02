"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, type ProductRow } from "@/types/content";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("products").select("*").order("name");
    setProducts(data ?? []);
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) return;
    await supabase.from("products").insert({ name, price: Number(price) });
    setName("");
    setPrice("");
    load();
  }

  async function handleToggle(p: ProductRow) {
    await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus produk ini?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <SectionHeading eyebrow="Admin" title="Kelola Produk" />

      <form onSubmit={handleAdd} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-mist p-5">
        <input placeholder="Nama produk" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-mist px-4 py-2.5 text-sm" />
        <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl border border-mist px-4 py-2.5 text-sm" />
        <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-cream">
          Tambah
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl border border-mist p-5">
            <div>
              <p className="font-semibold text-ink">
                {p.name} {!p.active && <span className="ml-2 text-xs text-ink/40">(nonaktif)</span>}
              </p>
              <p className="text-sm text-ink/60">{formatPrice(p.price)}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleToggle(p)} className="text-primary">
                {p.active ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-red-600">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
