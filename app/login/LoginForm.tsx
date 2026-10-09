"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";

const inputClass =
  "mt-1.5 block w-full rounded-sm border border-navy/25 bg-white/80 px-4 py-3 text-base text-navy-deep shadow-inner outline-none transition-colors placeholder:text-navy-deep/40 focus:border-navy focus:ring-2 focus:ring-accent";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-5 text-left">
      <label className="block">
        <span className="text-sm font-semibold text-navy-deep">Логин</span>
        <input
          name="login"
          defaultValue={state?.login}
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-navy-deep">Пароль</span>
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </label>

      <p aria-live="polite" className="min-h-6 text-sm font-medium text-red-700">
        {state?.error}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-sm bg-accent px-8 py-4 font-accent text-base uppercase tracking-[0.2em] text-navy-deep shadow-[4px_4px_0_0_var(--color-navy)] transition-all hover:-translate-y-0.5 hover:bg-navy hover:text-paper hover:shadow-[6px_6px_0_0_var(--color-accent)] active:translate-y-0 active:shadow-none disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}
