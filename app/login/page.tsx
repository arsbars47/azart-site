import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/users";
import { contacts } from "@/lib/data";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Вход для бойцов — СОП «Азарт»",
  robots: { index: false },
};

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/profile");

  return (
    <section className="flex min-h-svh items-center justify-center px-6 py-24">
      <div className="paper-texture relative w-full max-w-md rotate-[-0.5deg] bg-paper px-6 py-12 text-center text-navy-deep shadow-2xl shadow-navy-deep/25 sm:px-10">
        <span aria-hidden className="tape absolute -top-3 left-8 h-7 w-24 -rotate-6" />
        <span aria-hidden className="tape absolute -top-3 right-8 h-7 w-24 rotate-6" />

        <p className="font-accent text-2xl text-navy">только для своих</p>
        <h1 className="mt-2 mb-8 text-3xl font-black uppercase tracking-wide text-navy md:text-4xl">Вход для бойцов</h1>

        <LoginForm />

        <p className="mt-8 text-sm leading-relaxed text-navy-deep/70">
          Регистрации нет: логин и пароль выдаёт командир. Забыли пароль — напишите на{" "}
          <a href={`mailto:${contacts.email}`} className="underline decoration-accent underline-offset-2 hover:text-navy">
            {contacts.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
