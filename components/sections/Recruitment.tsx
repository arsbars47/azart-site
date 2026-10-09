import Button from "@/components/ui/Button";

export default function Recruitment() {
  return (
    <section id="recruit" aria-labelledby="recruit-title" className="px-6 py-24 lg:py-32">
      <div className="paper-texture relative mx-auto max-w-3xl rotate-[-0.5deg] bg-paper px-6 py-14 text-center text-navy-deep shadow-2xl shadow-navy-deep/25 sm:px-12">
        <span aria-hidden className="tape absolute -top-3 left-8 h-7 w-24 -rotate-6" />
        <span aria-hidden className="tape absolute -top-3 right-8 h-7 w-24 rotate-6" />

        <p className="font-accent text-2xl text-navy">Ждём тебя!</p>
        <h2 id="recruit-title" className="mt-2 text-3xl font-black uppercase leading-tight tracking-wide text-navy md:text-5xl">
          Набор на сезон 2027 открыт
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-navy-deep/80">
          Бесплатное обучение, официальное трудоустройство, поездки и команда, которая станет второй семьёй. Опыт не
          нужен — нужен Азарт!
        </p>
        <Button
          className="mt-10"
          href="https://forms.yandex.ru/u/68f662d3f47e73250b7ea3e8/"
          size="lg"
          target="_blank"
          aria-describedby="recruit-form-notice"
        >
          Оставить заявку
        </Button>
        <p id="recruit-form-notice" className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-navy-deep/60">
          Нажимая кнопку «Оставить заявку», вы переходите на сторонний сервис Yandex Forms. Ознакомьтесь с{" "}
          <a
            href="https://yandex.ru/legal/confidential/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-navy"
          >
            Политикой конфиденциальности Yandex
          </a>
          .
        </p>
        <p className="mt-6 font-accent text-2xl text-navy/70">не сомневайся, пробуй!</p>
      </div>
    </section>
  );
}
