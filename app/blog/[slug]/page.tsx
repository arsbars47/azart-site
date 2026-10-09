import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/blog/Markdown";
import PhotoSlot from "@/components/ui/PhotoSlot";
import { formatPostDate, getPost, getPosts, readingMinutes } from "@/lib/blog";
import { photoSrc } from "@/lib/photos";

// только статьи из lib/blog.ts, остальные адреса — 404
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  return post
    ? { title: `${post.title} — СОП «Азарт»`, description: post.excerpt }
    : { title: "Статья не найдена" };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const cover = photoSrc("blog", post.slug);

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blog" className="font-accent text-xl text-navy/80 transition-colors hover:text-navy-deep">
        ← все статьи
      </Link>

      <header className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-deep/60">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {readingMinutes(post)} мин чтения · {post.author}
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase leading-tight tracking-wide text-navy md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-navy-deep/80">{post.excerpt}</p>
      </header>

      {cover && (
        <div className="paper-texture mt-10 -rotate-1 bg-paper-soft p-3 pb-4 shadow-xl shadow-navy-deep/25">
          <PhotoSlot src={cover} alt={post.title} sizes="(min-width: 768px) 720px, 100vw" className="aspect-video w-full" />
        </div>
      )}

      <div className="mt-10">
        <Markdown>{post.content}</Markdown>
      </div>

      <footer className="mt-16 border-t border-navy/15 pt-8">
        <Link href="/blog" className="font-accent text-2xl text-navy transition-colors hover:text-navy-deep">
          ← к другим историям
        </Link>
      </footer>
    </article>
  );
}
