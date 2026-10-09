import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JacketSlot from "@/components/ui/JacketSlot";
import Polaroid from "@/components/ui/Polaroid";
import { photoSrc } from "@/lib/photos";
import { getMember, memberFilters, members } from "@/lib/data";
import { getMemberProfile } from "@/lib/users";

// Страницы статические; после правок в /profile они обновляются сразу (revalidatePath),
// а раз в час — на случай, если админ привязал аккаунт к карточке скриптом
export const revalidate = 3600;

export function generateStaticParams() {
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: PageProps<"/members/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const member = getMember(slug);
  return { title: member ? `${member.name} — СОП «Азарт»` : "Боец не найден" };
}

export default async function MemberPage(props: PageProps<"/members/[slug]">) {
  const { slug } = await props.params;
  const member = getMember(slug);
  if (!member) notFound();

  // если к карточке привязан аккаунт — цитата и кирпичики из профиля бойца
  const profile = await getMemberProfile(member.slug);
  const quote = profile ? profile.quote : member.quote;
  const bricks = profile?.bricksCount ?? 0;

  const category = memberFilters.find((f) => f.value === member.category)?.label;
  const seasons = 2027 - member.since;

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <Link href="/#squad" className="font-accent text-xl text-navy/80 transition-colors hover:text-navy-deep">
        ← назад к составу
      </Link>

      <header className="mt-10 grid items-center gap-12 md:grid-cols-[minmax(0,18rem)_1fr]">
        <Polaroid photo={photoSrc("members", member.slug)} name={member.name} role={member.role} tilt="left" size="lg" className="mx-auto w-full max-w-xs" />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-navy-deep/70">{category}</p>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-wide text-navy md:text-6xl">{member.name}</h1>
          <p className="mt-2 text-lg font-medium text-navy-deep/80">{member.role}</p>
          {quote && (
            <blockquote className="mt-6 border-l-4 border-accent pl-4 font-accent text-3xl text-navy-deep">«{quote}»</blockquote>
          )}

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4">
            {[
              { label: "В отряде с", value: member.since },
              { label: "Сезонов", value: seasons },
              { label: "Кирпичиков", value: bricks },
            ].map((s) => (
              <div key={s.label} className="border border-navy/15 bg-white/50 p-3 shadow-sm">
                <dt className="text-[10px] font-semibold uppercase tracking-widest text-navy-deep/60">{s.label}</dt>
                <dd className="mt-1 text-2xl font-black text-navy">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mt-20">
        <JacketSlot bricks={bricks} />
      </div>
    </div>
  );
}
