/**
 * Фон «звёздное небо» с параллаксом при скролле.
 * Вся анимация — в globals.css (.starfield): слои с разной скоростью
 * двигаются через CSS scroll-driven animations, без JS.
 */
export default function Starfield() {
  return (
    <div aria-hidden className="starfield">
      <div className="starfield__layer starfield__layer--far" />
      <div className="starfield__layer starfield__layer--mid" />
      <div className="starfield__layer starfield__layer--near" />
    </div>
  );
}
