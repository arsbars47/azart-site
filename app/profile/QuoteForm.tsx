"use client";

import { useActionState, useState } from "react";
import { updateQuote } from "./actions";

type QuoteFormProps = { quote: string; maxLength: number };

export default function QuoteForm({ quote, maxLength }: QuoteFormProps) {
  const [state, formAction, pending] = useActionState(updateQuote, null);
  const [value, setValue] = useState(quote);

  return (
    <form action={formAction}>
      <label htmlFor="quote" className="sr-only">
        Моя цитата
      </label>
      <textarea
        id="quote"
        name="quote"
        rows={3}
        maxLength={maxLength}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Фраза, которая про тебя"
        className="block w-full resize-none rounded-sm border border-navy/25 bg-white/80 px-4 py-3 text-lg text-navy-deep shadow-inner outline-none transition-colors placeholder:text-navy-deep/40 focus:border-navy focus:ring-2 focus:ring-accent"
      />
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          type="submit"
          disabled={pending || value.trim() === quote}
          className="rounded-sm bg-accent px-6 py-3 font-accent text-sm uppercase tracking-[0.2em] text-navy-deep shadow-[3px_3px_0_0_var(--color-navy)] transition-all hover:-translate-y-0.5 hover:bg-navy hover:text-paper active:translate-y-0 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
        >
          {pending ? "Сохраняем…" : "Сохранить"}
        </button>
        <span className="text-sm text-navy-deep/60">
          {value.length} / {maxLength}
        </span>
        <p aria-live="polite" className={`text-sm font-medium ${state?.ok ? "text-emerald-700" : "text-red-700"}`}>
          {state?.message}
        </p>
      </div>
    </form>
  );
}
