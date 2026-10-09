import { SocialIcon } from "@/components/icons";
import Carousel from "@/components/ui/Carousel";
import FilmFrame from "@/components/ui/FilmFrame";
import SectionHeading from "@/components/ui/SectionHeading";
import { socials } from "@/lib/data";
import { getVkPosts } from "@/lib/vk";

const vkGroup = socials.find((s) => s.icon === "vk");

/** Последние посты из группы ВКонтакте — серверный компонент, ключ VK остаётся на сервере. */
export default async function LatestNews() {
  const posts = await getVkPosts();

  return (
    <section id="news" aria-labelledby="news-title" className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
      <SectionHeading id="news-title" title="Последние новости" note="с плёнки отряда" />

      {posts && posts.length > 0 ? (
        <Carousel label="Новости отряда" footer={vkGroup && <VkLink href={vkGroup.href} />}>
          {posts.map((post, i) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="block w-[78vw] max-w-xs shrink-0 snap-start focus-visible:outline-none focus-visible:[&>article]:ring-4 focus-visible:[&>article]:ring-accent sm:w-80 sm:max-w-none"
            >
              <FilmFrame
                photo={post.photo}
                unoptimized
                title={post.title}
                excerpt={post.excerpt}
                caption={post.date}
                frame={String(i + 1).padStart(2, "0")}
                className="h-full"
              />
            </a>
          ))}
        </Carousel>
      ) : (
        <div className="paper-texture max-w-xl bg-paper-soft px-6 py-8 shadow-xl shadow-navy-deep/15">
          <p className="font-accent text-2xl text-navy">плёнка проявляется…</p>
          <p className="mt-2 leading-relaxed text-navy-deep/80">
            {posts ? "Новостей пока нет." : "Не получилось загрузить новости."} Всё самое свежее — в нашей группе ВКонтакте.
          </p>
          {vkGroup && (
            <div className="mt-5">
              <VkLink href={vkGroup.href} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function VkLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm font-semibold text-navy underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-navy-deep"
    >
      <SocialIcon name="vk" className="h-5 w-5" />
      Все новости во ВКонтакте
    </a>
  );
}
