"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/client";

type CustomerRow = { id: string; full_name: string; phone: string };

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [selected, setSelected] = useState<CustomerRow | null>(null);
  const [history, setHistory] = useState<{ code: string; date: string; time: string; status: string }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, full_name, phone")
      .eq("role", "customer")
      .then(({ data }) => setCustomers(data ?? []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function viewHistory(c: CustomerRow) {
    setSelected(c);
    const { data } = await supabase.from("bookings").select("code, date, time, status").eq("customer_id", c.id).order("date", { ascending: false });
    setHistory(data ?? []);
  }

  return (
    <div>
      <SectionHeading eyebrow="Admin" title="Kelola Customer" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          {customers.map((c) => (
            <button key={c.id} onClick={() => viewHistory(c)} className="block w-full rounded-2xl border border-mist p-4 text-left hover:border-primary/50">
              <p className="font-semibold text-ink">{c.full_name}</p>
              <p className="text-sm text-ink/60">{c.phone}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div>
            <h3 className="font-semibold text-ink">Riwayat Booking — {selected.full_name}</h3>
            <div className="mt-3 space-y-2">
              {history.length === 0 && <p className="text-sm text-ink/50">Belum ada booking.</p>}
              {history.map((h) => (
                <div key={h.code} className="rounded-xl bg-mist/50 p-3 text-sm">
                  <p className="font-medium text-ink">{h.code}</p>
                  <p className="text-ink/60">
                    {h.date} • {h.time} • {h.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
