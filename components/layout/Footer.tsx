import Link from "next/link";
import { contacts, navLinks, socials } from "@/lib/data";
import { SocialIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer id="contacts" className="bg-navy text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
        <div>
          <p className="font-display text-xl tracking-[0.2em]">АЗАРТ</p>
          <p className="mt-1 font-accent text-2xl text-accent">Работаем летом, дружим целый год</p>
        </div>

        <nav aria-label="Навигация в подвале">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-sky">Навигация</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-paper/85 transition-colors hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-sky">Контакты</h2>
          <ul className="mt-4 space-y-2 text-sm text-paper/85">
            <li>{contacts.city}</li>
            <li>
              <a href={`mailto:${contacts.email}`} className="transition-colors hover:text-accent">
                {contacts.email}
              </a>
            </li>
            <li>
              Командир:{" "}
              <a href={`tel:${contacts.commander.tel}`} className="whitespace-nowrap transition-colors hover:text-accent">
                {contacts.commander.phone}
              </a>{" "}
              ({contacts.commander.name})
            </li>
          </ul>
          <ul className="mt-5 flex gap-3">
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

      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <p className="font-accent text-lg text-paper/60">© {new Date().getFullYear()} СОП «Азарт» — сделано с азартом</p>
          {/* возрастная маркировка информационной продукции (436-ФЗ) */}
          <p
            aria-label="Возрастное ограничение: 16+"
            className="shrink-0 rounded-sm border border-paper/40 px-2 py-0.5 text-sm font-bold tracking-wide text-paper/80"
          >
            16+
          </p>
        </div>
      </div>
    </footer>
  );
}
