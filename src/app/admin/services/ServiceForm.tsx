"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { ServiceRow } from "@/types/content";
import { serviceSchema } from "@/lib/validation";

export default function ServiceForm({ service, onSaved, onCancel }: { service?: ServiceRow; onSaved: () => void; onCancel: () => void }) {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service?.price?.toString() ?? "");
  const [duration, setDuration] = useState(service?.duration_minutes?.toString() ?? "");
  const [active, setActive] = useState(service?.active ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = serviceSchema.safeParse({ name, description, price, duration_minutes: duration });
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const payload = {
      name,
      description,
      price: Number(price),
      duration_minutes: Number(duration),
      active,
    };

    if (service) {
      await supabase.from("services").update(payload).eq("id", service.id);
    } else {
      await supabase.from("services").insert(payload);
    }

    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-mist p-5">
      <input required placeholder="Nama layanan" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm" />
      <textarea placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm" rows={2} />
      <div className="flex gap-3">
        <input required type="number" placeholder="Harga (Rp)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm" />
        <input required type="number" placeholder="Durasi (menit)" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Aktif (tampil di halaman publik)
      </label>
      <div className="flex gap-3">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
        <button type="button" onClick={onCancel} className="text-sm text-ink/60 underline">
          Batal
        </button>
      </div>
    </form>
  );
}
