import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Container from "@/components/layout/Container";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="border-t border-mist bg-mist/30 py-10">
      <Container>
        <div className="rounded-2xl bg-white p-6">{children}</div>
      </Container>
    </div>
  );
}
