import type { Metadata } from "next";
import Link from "next/link";
import { QUOTE_MAX_LENGTH, requireUser } from "@/lib/users";
import { logout } from "./actions";
import BricksEditor from "./BricksEditor";
import QuoteForm from "./QuoteForm";

export const metadata: Metadata = {
  title: "Профиль — СОП «Азарт»",
  robots: { index: false },
};

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-accent text-2xl text-navy-deep/75">личный кабинет бойца</p>
          <h1 className="mt-1 text-4xl font-black uppercase tracking-wide text-navy md:text-6xl">{user.name}</h1>
          <p className="mt-2 text-sm text-navy-deep/70">
            логин: <span className="font-semibold text-navy-deep">{user.login}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user.memberSlug && (
            <Link
              href={`/members/${user.memberSlug}`}
              className="rounded-sm border border-navy/30 bg-white/50 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy hover:bg-white/80"
            >
              Моя страница в составе →
            </Link>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="rounded-sm border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy-deep/80 transition-colors hover:border-red-700 hover:text-red-700"
            >
              Выйти
            </button>
          </form>
        </div>
      </header>

      <section aria-labelledby="quote-title" className="mt-14 max-w-2xl">
        <h2 id="quote-title" className="text-2xl font-black uppercase tracking-wide text-navy md:text-3xl">
          Моя цитата
        </h2>
        <p className="mt-1 mb-4 text-sm text-navy-deep/70">
          {user.memberSlug ? "Показывается на твоей странице в составе отряда." : "Пока видна только тебе."}
        </p>
        <QuoteForm quote={user.quote} maxLength={QUOTE_MAX_LENGTH} />
      </section>

      <section aria-labelledby="jacket-title" className="mt-16">
        <h2 id="jacket-title" className="text-2xl font-black uppercase tracking-wide text-navy md:text-3xl">
          Моя бойцовка
        </h2>
        <p className="mt-1 mb-8 text-sm text-navy-deep/70">Отмечай кирпичиками на воротнике каждую отработанную целину.</p>
        <BricksEditor count={user.bricksCount} />
      </section>
    </div>
  );
}
