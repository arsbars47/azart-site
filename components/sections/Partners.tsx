import SectionHeading from "@/components/ui/SectionHeading";

/** Заглушка: когда появятся партнёры — заменить текст на сетку логотипов. */
export default function Partners() {
  return (
    <section id="partners" aria-labelledby="partners-title" className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
      <SectionHeading id="partners-title" title="Партнёры" note="те, кто с нами" />

      <div className="placeholder-stripes flex min-h-40 items-center justify-center rounded-lg border-2 border-dashed border-navy/25 bg-white/30 px-6 py-12">
        <p className="text-center font-accent text-2xl text-navy/60 md:text-3xl">Здесь скоро появятся наши партнёры</p>
      </div>
    </section>
  );
}
