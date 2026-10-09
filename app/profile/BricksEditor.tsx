"use client";

import { useOptimistic, useState, useTransition } from "react";
import Jacket from "@/components/jacket/Jacket";
import { brickColor, bricksLabel, MAX_BRICKS } from "@/lib/bricks";
import { saveBricks } from "./actions";

const stepClass =
  "flex h-12 w-12 items-center justify-center rounded-full border-2 border-navy/30 bg-white/60 text-2xl font-bold text-navy transition-colors hover:border-navy hover:bg-accent disabled:pointer-events-none disabled:opacity-35";

/**
 * Кирпичики на воротнике: «+» и «−». Куртка меняется сразу (useOptimistic),
 * число тут же сохраняется на сервере; если сервер отказал — вернётся сохранённое.
 */
export default function BricksEditor({ count }: { count: number }) {
  const [optimistic, setOptimistic] = useOptimistic(count);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function update(next: number) {
    setError(null);
    startTransition(async () => {
      setOptimistic(next);
      const result = await saveBricks(next);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <Jacket bricks={optimistic} />

      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-navy">Кирпичики на воротнике</h3>
        <p className="mt-2 leading-relaxed text-navy-deep/80">
          Один кирпичик — одна отработанная целина. Они крепятся на воротник слева направо.
        </p>

        <div className="mt-6 flex items-center gap-5">
          <button
            type="button"
            onClick={() => update(optimistic - 1)}
            disabled={optimistic <= 0}
            aria-label="Снять кирпичик"
            className={stepClass}
          >
            −
          </button>
          <p aria-live="polite" className="min-w-36 text-center">
            <span className="block text-5xl font-black text-navy">{optimistic}</span>
            <span className="text-sm text-navy-deep/70">{bricksLabel(optimistic).replace(/^\d+ /, "")} из {MAX_BRICKS}</span>
          </p>
          <button
            type="button"
            onClick={() => update(optimistic + 1)}
            disabled={optimistic >= MAX_BRICKS}
            aria-label="Добавить кирпичик"
            className={stepClass}
          >
            +
          </button>
        </div>

        {/* мини-шкала: заполненные места на воротнике */}
        <ul aria-hidden className="mt-5 flex gap-1.5">
          {Array.from({ length: MAX_BRICKS }, (_, i) => (
            <li
              key={i}
              className={`h-3 w-7 rounded-[2px] border ${
                i < optimistic ? `${brickColor(i).bg} border-navy-deep/40` : "border-dashed border-navy/30"
              }`}
            />
          ))}
        </ul>

        <p aria-live="polite" className="mt-3 min-h-5 text-sm font-medium text-red-700">
          {error}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-navy-deep/70">
          Шевроны «Штаб», «Азарт», «РСО» и «НРО» на рукавах есть у всех бойцов.
        </p>
      </div>
    </div>
  );
}
