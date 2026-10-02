"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { GalleryRow } from "@/types/content";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("gallery-photos").upload(fileName, file);

    if (!uploadError) {
      const { data } = supabase.storage.from("gallery-photos").getPublicUrl(fileName);
      await supabase.from("gallery_items").insert({ image_url: data.publicUrl, label });
      setFile(null);
      setLabel("");
      load();
    }
    setUploading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus foto ini?")) return;
    await supabase.from("gallery_items").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <SectionHeading eyebrow="Admin" title="Kelola Galeri" />

      <form onSubmit={handleUpload} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-mist p-5">
        <div>
          <label className="mb-1.5 block text-sm text-ink/70">Foto</label>
          <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
        </div>
        <input placeholder="Label (opsional)" value={label} onChange={(e) => setLabel(e.target.value)} className="rounded-xl border border-mist px-4 py-2.5 text-sm" />
        <Button type="submit" size="sm" disabled={uploading}>
          {uploading ? "Mengunggah..." : "Unggah"}
        </Button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-mist">
            <Image src={item.image_url} alt={item.label} fill className="object-cover" />
            <button onClick={() => handleDelete(item.id)} className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
