"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/client";
import type { BarberRow } from "@/types/content";
import BarberForm from "./BarberForm";

export default function AdminBarbersPage() {
  const [barbers, setBarbers] = useState<BarberRow[]>([]);
  const [editing, setEditing] = useState<BarberRow | "new" | null>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("barbers").select("*").order("name");
    setBarbers(data ?? []);
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDeactivate(b: BarberRow) {
    await supabase.from("barbers").update({ active: !b.active }).eq("id", b.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <SectionHeading eyebrow="Admin" title="Kelola Barber" />
        <button onClick={() => setEditing("new")} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-cream">
          + Tambah Barber
        </button>
      </div>

      {editing === "new" && (
        <BarberForm
          onSaved={() => {
            setEditing(null);
            load();
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="mt-6 space-y-3">
        {barbers.map((b) =>
          editing === b ? (
            <BarberForm
              key={b.id}
              barber={b}
              onSaved={() => {
                setEditing(null);
                load();
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div key={b.id} className="flex items-center justify-between rounded-2xl border border-mist p-5">
              <div>
                <p className="font-semibold text-ink">
                  {b.name} {!b.active && <span className="ml-2 text-xs text-ink/40">(nonaktif)</span>}
                </p>
                <p className="text-sm text-ink/60">{b.specialty}</p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => setEditing(b)} className="text-primary">
                  Edit
                </button>
                <button onClick={() => handleDeactivate(b)} className="text-red-600">
                  {b.active ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
