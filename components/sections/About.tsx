import SectionHeading from "@/components/ui/SectionHeading";
import { members } from "@/lib/data";

const facts = [
  { value: "2010", label: "год основания отряда" },
  { value: String(members.length), label: "бойцов в составе" },
  { value: "3 мес.", label: "длится летний сезон — целина" },
  { value: "∞", label: "друзей, дорог и историй" },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
      <SectionHeading id="about-title" title="Об отряде" note="кто мы такие" />

      <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-start">
        <div className="space-y-5 text-lg leading-relaxed text-navy-deep/85">
          <p>
            <strong className="font-semibold text-navy-deep">СОП «Азарт»</strong> — студенческий отряд проводников из
            Новосибирска. С 2010 года мы собираем студентов, которые хотят провести лето с пользой: поработать, увидеть
            страну и найти друзей на всю жизнь.
          </p>
          <p>
            Летом, на целине, бойцы работают проводниками пассажирских поездов дальнего следования: встречают
            пассажиров, отвечают за порядок и уют в вагоне и проезжают тысячи километров по России.
          </p>
          <p>
            В остальное время отряд живёт своей жизнью: слёты и спартакиады, добровольческие акции, творческие вечера и
            песни у костра. Перед сезоном кандидаты проходят обучение — опыт не нужен, всему научим.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4">
          {facts.map((fact, i) => (
            // число визуально сверху, но в разметке подпись (dt) идёт первой — так её читают скринридеры
            <div
              key={fact.label}
              className={`paper-texture flex flex-col-reverse bg-paper-soft p-5 shadow-lg shadow-navy-deep/15 ${i % 2 ? "rotate-1" : "-rotate-1"}`}
            >
              <dt className="mt-1 text-sm leading-snug text-navy-deep/75">{fact.label}</dt>
              <dd className="text-3xl font-black text-navy md:text-4xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
