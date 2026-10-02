"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { BarberRow, WorkingHours } from "@/types/content";
import { barberSchema } from "@/lib/validation";

const DAYS = [
  { key: 1, label: "Senin" },
  { key: 2, label: "Selasa" },
  { key: 3, label: "Rabu" },
  { key: 4, label: "Kamis" },
  { key: 5, label: "Jumat" },
  { key: 6, label: "Sabtu" },
  { key: 0, label: "Minggu" },
];

export default function BarberForm({ barber, onSaved, onCancel }: { barber?: BarberRow; onSaved: () => void; onCancel: () => void }) {
  const [name, setName] = useState(barber?.name ?? "");
  const [specialty, setSpecialty] = useState(barber?.specialty ?? "");
  const [bio, setBio] = useState(barber?.bio ?? "");
  const [whatsapp, setWhatsapp] = useState(barber?.whatsapp_number ?? "");
  const [active, setActive] = useState(barber?.active ?? true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [hours, setHours] = useState<WorkingHours>(barber?.working_hours ?? {});
  const [saving, setSaving] = useState(false);

  function toggleDayOff(day: number) {
    setHours((prev) => ({ ...prev, [day]: prev[day] ? null : { start: "10:00", end: "21:00" } }));
  }

  function updateHour(day: number, field: "start" | "end", value: string) {
    setHours((prev) => ({
      ...prev,
      [day]: { ...(prev[day] as { start: string; end: string }), [field]: value },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = barberSchema.safeParse({ name, whatsapp_number: whatsapp });
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    setSaving(true);
    const supabase = createClient();

    let photoUrl = barber?.photo_url ?? null;

    if (photoFile) {
      const fileName = `${Date.now()}-${photoFile.name}`;
      const { error: uploadError } = await supabase.storage.from("barber-photos").upload(fileName, photoFile);

      if (!uploadError) {
        const { data } = supabase.storage.from("barber-photos").getPublicUrl(fileName);
        photoUrl = data.publicUrl;
      }
    }

    const payload = {
      name,
      specialty,
      bio,
      whatsapp_number: whatsapp,
      active,
      photo_url: photoUrl,
      working_hours: hours,
    };

    if (barber) {
      await supabase.from("barbers").update(payload).eq("id", barber.id);
    } else {
      await supabase.from("barbers").insert(payload);
    }

    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-mist p-5">
      <input required placeholder="Nama barber" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm" />
      <input placeholder="Spesialisasi" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm" />
      <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm" rows={2} />
      <input required placeholder="Nomor WhatsApp (62xxxxxxxxxx)" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm" />

      <div>
        <label className="mb-1.5 block text-sm text-ink/70">Foto Barber</label>
        <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} className="text-sm" />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Jadwal Kerja</p>
        <div className="space-y-2">
          {DAYS.map((d) => {
            const schedule = hours[d.key];
            return (
              <div key={d.key} className="flex items-center gap-3 text-sm">
                <span className="w-16 text-ink/60">{d.label}</span>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={!schedule} onChange={() => toggleDayOff(d.key)} />
                  Libur
                </label>
                {schedule && (
                  <>
                    <input type="time" value={schedule.start} onChange={(e) => updateHour(d.key, "start", e.target.value)} className="rounded-lg border border-mist px-2 py-1" />
                    <span>–</span>
                    <input type="time" value={schedule.end} onChange={(e) => updateHour(d.key, "end", e.target.value)} className="rounded-lg border border-mist px-2 py-1" />
                  </>
                )}
              </div>
            );
          })}
        </div>
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
