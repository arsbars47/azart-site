import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";

// Оформление элементов статьи. HTML внутри Markdown не выполняется — react-markdown
// по умолчанию его экранирует, так что текст статьи не может сломать страницу.
const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 text-2xl font-black uppercase tracking-wide text-navy md:text-3xl">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-bold text-navy">{children}</h3>,
  p: ({ children }) => <p className="my-5">{children}</p>,
  ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-accent-deep">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:font-bold marker:text-navy">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-4 border-accent pl-5 font-accent text-2xl leading-snug text-navy md:text-3xl [&_p]:my-0">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-semibold text-navy-deep">{children}</strong>,
  a: ({ href = "", children }) => {
    const className = "font-medium text-navy underline decoration-accent decoration-2 underline-offset-2 hover:text-navy-deep";
    // свои страницы — через Link (без перезагрузки), внешние — в новой вкладке
    return href.startsWith("/") ? (
      <Link href={href} className={className}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  },
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="text-lg leading-relaxed text-navy-deep/90">
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
