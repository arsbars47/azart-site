"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type CarouselProps = {
  /** подпись для скринридеров, например «Новости отряда» */
  label: string;
  children: ReactNode;
  /** что показать в строке со стрелками слева (например, ссылку «все новости») */
  footer?: ReactNode;
};

const arrowClass =
  "flex h-11 w-11 items-center justify-center rounded-full border border-navy/30 bg-white/60 text-lg text-navy transition-colors hover:border-navy hover:bg-accent disabled:pointer-events-none disabled:opacity-35";

/**
 * Горизонтальная лента со snap-прокруткой: на телефоне листается пальцем,
 * на компьютере — колесом/тачпадом или стрелками. Карточки — дети компонента.
 */
export default function Carousel({ label, children, footer }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({
        start: track.scrollLeft <= 4,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
      });
    // ResizeObserver срабатывает сразу после подключения — начальное состояние тоже отсюда
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, []);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <div role="region" aria-roledescription="карусель" aria-label={label}>
      <div
        ref={trackRef}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto overscroll-x-contain px-6 py-4 lg:-mx-10 lg:scroll-px-10 lg:px-10"
      >
        {children}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>{footer}</div>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => scroll(-1)} disabled={edges.start} aria-label="Назад" className={arrowClass}>
            ←
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={edges.end} aria-label="Вперёд" className={arrowClass}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
