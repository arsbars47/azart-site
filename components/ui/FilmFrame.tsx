import PhotoSlot from "@/components/ui/PhotoSlot";

type FilmFrameProps = {
  /** адрес фото или null — тогда заглушка с камерой */
  photo: string | null;
  title: string;
  caption: string;
  excerpt?: string;
  frame?: string;
  featured?: boolean;
  className?: string;
  /** внешняя картинка (CDN ВК) — без оптимизатора next/image */
  unoptimized?: boolean;
};

/** Карточка новости в виде кадра фотоплёнки с перфорацией сверху и снизу. */
export default function FilmFrame({ photo, title, caption, excerpt, frame = "01", featured = false, className = "", unoptimized = false }: FilmFrameProps) {
  return (
    <article
      className={`group relative flex flex-col bg-navy shadow-xl shadow-navy-deep/30 ring-1 ring-navy-deep/20 transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* верхняя перфорация + маркировка плёнки */}
      <div className="relative px-1 pt-1.5">
        <div className="film-perf" />
        <span className="absolute top-0.5 right-3 font-mono text-[9px] tracking-widest text-paper/80">
          AZART 400 ▸ {frame}
        </span>
      </div>

      {/* кадр: фото целиком (object-contain) в области с фиксированными пропорциями —
          вертикальные и горизонтальные снимки не ломают сетку, поля залиты тёмно-синим */}
      <div className="mx-2 my-1.5 flex flex-1 flex-col overflow-hidden rounded-[3px] bg-paper-soft md:mx-3 md:my-2">
        <PhotoSlot
          src={photo}
          alt={title}
          sizes={featured ? "(min-width: 768px) 720px, 75vw" : "(min-width: 1024px) 360px, (min-width: 768px) 50vw, 75vw"}
          fit="contain"
          unoptimized={unoptimized}
          matteClassName="bg-navy-deep"
          className={`h-40 w-full md:h-auto ${featured ? "md:aspect-video" : "md:aspect-[4/3]"}`}
          iconClassName="h-8 w-8 text-white/80 transition-transform duration-300 group-hover:scale-110 md:h-10 md:w-10"
        />

        <div className="flex flex-1 flex-col gap-1.5 p-3 md:gap-2 md:p-4">
          <h3 className={`font-bold leading-tight text-navy ${featured ? "text-lg md:text-3xl" : "text-base md:text-lg"}`}>
            {title}
          </h3>
          {excerpt && <p className="text-sm leading-snug text-navy-deep/75 md:text-base md:leading-relaxed">{excerpt}</p>}
        </div>
      </div>

      {/* рукописная подпись */}
      <p className="px-3 pb-0.5 font-accent text-lg text-accent md:px-4 md:pb-1 md:text-xl">{caption}</p>

      {/* нижняя перфорация */}
      <div className="px-1 pb-1.5">
        <div className="film-perf" />
      </div>
    </article>
  );
}
