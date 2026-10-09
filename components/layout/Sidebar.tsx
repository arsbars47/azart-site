"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import azartLogo from "@/public/azart.png";
import { navLinks, socials } from "@/lib/data";
import { SocialIcon } from "@/components/icons";

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="group block">
      <Image
        src={azartLogo}
        alt="Эмблема СОП «Азарт»"
        sizes="96px"
        loading="eager"
        className="h-24 w-24 drop-shadow-[0_4px_10px_rgb(27_53_102/0.35)] transition-transform duration-300 group-hover:-rotate-6"
      />
      <span className="mt-3 block font-display text-xl tracking-[0.2em] text-paper">АЗАРТ</span>
      <span className="font-accent text-lg leading-none text-accent">студенческий отряд проводников</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-7 py-8">
      <Logo onNavigate={onNavigate} />

      <nav aria-label="Основное меню" className="mt-12 flex-1">
        <ul className="space-y-1">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className="group flex items-baseline gap-3 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-paper/90 transition-colors hover:text-accent"
              >
                <span className="font-accent text-base tracking-normal text-sky group-hover:text-accent">
                  0{i + 1}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* без входа /profile перенаправит на /login */}
      <Link
        href="/profile"
        onClick={onNavigate}
        className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-paper/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-paper/90 transition-colors hover:border-accent hover:text-accent"
      >
        Кабинет бойца →
      </Link>

      <div>
        <p className="font-accent text-lg text-sky">мы в сети</p>
        <ul className="mt-2 flex gap-3">
          {socials.map((s) => (
            <li key={s.icon}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:border-accent hover:bg-accent hover:text-navy-deep"
              >
                <SocialIcon name={s.icon} className="h-5 w-5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Escape закрывает шторку, фон не скроллится, пока она открыта
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Десктоп: фиксированный вертикальный sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-sidebar bg-navy shadow-[4px_0_24px_rgb(27_53_102/0.25)] lg:block">
        <SidebarContent />
      </aside>

      {/* Мобилки: плавающий бургер */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="fixed top-4 right-4 z-60 flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full bg-accent text-navy-deep shadow-lg shadow-navy-deep/30 transition-transform active:scale-95 lg:hidden"
      >
        <span className={`h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`h-0.5 w-6 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
        <span className={`h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {/* Затемнение под шторкой */}
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-50 bg-navy-deep/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Выезжающая шторка */}
      <aside
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-navy shadow-2xl shadow-navy-deep/50 transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onNavigate={close} />
      </aside>
    </>
  );
}
