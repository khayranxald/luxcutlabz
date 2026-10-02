import { cn } from "@/lib/utils";

export default function SectionHeading({ eyebrow, title, description, align = "left", className }: { eyebrow?: string; title: string; description?: string; align?: "left" | "center"; className?: string }) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
      <h2 className="text-3xl text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-ink/70">{description}</p>}
    </div>
  );
}
