"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, type ServiceRow } from "@/types/content";
import ServiceForm from "./ServiceForm";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [editing, setEditing] = useState<ServiceRow | "new" | null>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("services").select("*").order("price");
    setServices(data ?? []);
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(id: string) {
    if (!confirm("Hapus layanan ini?")) return;
    await supabase.from("services").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <SectionHeading eyebrow="Admin" title="Kelola Layanan" />
        <button onClick={() => setEditing("new")} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-cream">
          + Tambah Layanan
        </button>
      </div>

      {editing === "new" && (
        <ServiceForm
          onSaved={() => {
            setEditing(null);
            load();
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="mt-6 space-y-3">
        {services.map((s) =>
          editing === s ? (
            <ServiceForm
              key={s.id}
              service={s}
              onSaved={() => {
                setEditing(null);
                load();
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div key={s.id} className="flex items-center justify-between rounded-2xl border border-mist p-5">
              <div>
                <p className="font-semibold text-ink">
                  {s.name} {!s.active && <span className="ml-2 text-xs text-ink/40">(nonaktif)</span>}
                </p>
                <p className="text-sm text-ink/60">
                  {formatPrice(s.price)} • {s.duration_minutes} menit
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => setEditing(s)} className="text-primary">
                  Edit
                </button>
                <button onClick={() => handleDelete(s.id)} className="text-red-600">
                  Hapus
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
