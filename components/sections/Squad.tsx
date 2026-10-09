"use client";

import Link from "next/link";
import { useState } from "react";
import Polaroid from "@/components/ui/Polaroid";
import SectionHeading from "@/components/ui/SectionHeading";
import { memberFilters, type Member, type MemberCategory } from "@/lib/data";

type SquadProps = {
  /** бойцы с путями к фото — пути считает сервер (app/page.tsx → lib/photos.ts) */
  members: (Member & { photo: string | null })[];
};

export default function Squad({ members }: SquadProps) {
  const [filter, setFilter] = useState<MemberCategory | "all">("all");
  const visible = filter === "all" ? members : members.filter((m) => m.category === filter);

  return (
    <section id="squad" aria-labelledby="squad-title" className="bg-white/30 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading id="squad-title" title="Состав отряда" note="лица «Азарта»" />

        {/* Фильтр-меню */}
        <div role="group" aria-label="Фильтр состава" className="-mx-6 mb-12 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {memberFilters.map((f) => {
            const active = f.value === filter;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-5 py-2 font-accent text-sm uppercase tracking-[0.15em] transition-colors ${
                  active
                    ? "border-accent bg-accent text-navy-deep shadow-[3px_3px_0_0_var(--color-navy)]"
                    : "border-navy/30 bg-white/40 text-navy hover:border-navy hover:bg-white/70"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((m, i) => (
            <li key={m.slug}>
              <Link href={`/members/${m.slug}`} className="block focus-visible:outline-none focus-visible:[&>figure]:ring-4 focus-visible:[&>figure]:ring-accent">
                <Polaroid photo={m.photo} name={m.name} role={m.role} tilt={i % 3 === 0 ? "left" : i % 3 === 1 ? "right" : "none"} />
              </Link>
            </li>
          ))}
        </ul>

        {visible.length === 0 && (
          <p className="text-center font-accent text-2xl text-navy/60">пока никого — но скоро будут</p>
        )}
      </div>
    </section>
  );
}
