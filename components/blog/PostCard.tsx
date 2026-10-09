import Link from "next/link";
import PhotoSlot from "@/components/ui/PhotoSlot";
import { formatPostDate, readingMinutes, type BlogPost } from "@/lib/blog";

type PostCardProps = {
  post: BlogPost;
  /** обложка из photoSrc("blog", slug) или null */
  cover: string | null;
  /** крупная карточка главной статьи */
  featured?: boolean;
};

/** Карточка статьи в списке блога. */
export default function PostCard({ post, cover, featured = false }: PostCardProps) {
  return (
    <article
      className={`paper-texture group relative flex w-full flex-col overflow-hidden bg-paper-soft shadow-xl shadow-navy-deep/20 transition-transform duration-300 hover:-translate-y-1 ${
        featured ? "md:grid md:grid-cols-[3fr_2fr]" : ""
      }`}
    >
      <PhotoSlot
        src={cover}
        alt=""
        sizes={featured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"}
        className={`w-full ${featured ? "aspect-video md:aspect-auto md:h-full md:min-h-80" : "aspect-video"}`}
        iconClassName="h-10 w-10 text-white/80 transition-transform duration-300 group-hover:scale-110"
      />

      <div className={`flex flex-1 flex-col p-5 ${featured ? "md:p-8" : ""}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-deep/60">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {readingMinutes(post)} мин чтения
        </p>
        <h2
          className={`mt-2 font-sans font-bold leading-tight text-navy ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}
        >
          {/* растянутая ссылка: кликабельна вся карточка */}
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-4 focus-visible:after:ring-accent">
            {post.title}
          </Link>
        </h2>
        <p className={`mt-3 leading-relaxed text-navy-deep/80 ${featured ? "md:text-lg" : "text-sm"}`}>{post.excerpt}</p>
        <p className="mt-auto pt-5 font-accent text-xl text-accent-deep">читать →</p>
      </div>
    </article>
  );
}
