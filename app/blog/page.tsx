import type { Metadata } from "next";
import PostCard from "@/components/blog/PostCard";
import { getPosts } from "@/lib/blog";
import { photoSrc } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Блог — СОП «Азарт»",
  description: "Главные новости и большие истории студенческого отряда проводников «Азарт».",
};

export default function BlogPage() {
  const posts = getPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <header className="mb-12">
        <p className="font-accent text-2xl text-navy-deep/75">большие истории отряда</p>
        <h1 className="text-4xl font-black uppercase tracking-wide text-navy md:text-6xl">Блог</h1>
        <span aria-hidden className="mt-4 block h-1.5 w-16 bg-accent" />
      </header>

      {featured ? (
        <>
          <PostCard post={featured} cover={photoSrc("blog", featured.slug)} featured />
          {rest.length > 0 && (
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <li key={post.slug} className="flex">
                  <PostCard post={post} cover={photoSrc("blog", post.slug)} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="font-accent text-2xl text-navy/60">статьи скоро появятся</p>
      )}
    </div>
  );
}
