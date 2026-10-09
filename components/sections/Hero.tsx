import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-6 py-24">
      {/* мягкое свечение за заголовком — фон даёт звёздное небо (Starfield) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_48%,rgb(255_255_255/0.55),transparent_70%)]"
      />

      <div className="max-w-4xl text-center">
        <p className="font-accent text-2xl text-navy md:text-3xl">с 2010 года · сезон 2027</p>
        <h1 className="mt-4 font-black uppercase leading-[0.95] tracking-wide">
          <span className="block text-2xl tracking-[0.18em] text-navy-deep sm:text-3xl md:text-4xl">
            Студенческий отряд проводников
          </span>
          <span className="mt-3 block text-6xl text-navy [text-shadow:4px_4px_0_var(--color-accent)] sm:text-8xl md:text-9xl md:[text-shadow:7px_7px_0_var(--color-accent)]">
            Азарт
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base font-medium leading-relaxed text-navy-deep/85 md:text-lg">
          Новые друзья, множество знакомств, бесконечные возможности. Работаем, путешествуем, и растём вместе!
          Вступай в сезон 2027 вместе с нами!
        </p>
        <Button href="/#recruit" size="lg" className="mt-10">
          Вступить
        </Button>
      </div>

      <a
        href="#about"
        aria-label="Листать вниз"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-accent text-xl text-navy/70 transition-colors hover:text-navy"
      >
        листай ↓
      </a>
    </section>
  );
}
