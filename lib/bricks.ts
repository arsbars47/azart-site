/**
 * «Кирпичики» — значки за отработанные целины. Крепятся на воротник бойцовки
 * слева направо; в базе хранится только их количество (User.bricksCount).
 */

/** Сколько кирпичиков помещается на воротник — по числу мест в components/jacket/Jacket.tsx */
export const MAX_BRICKS = 8;

/** Цвета кирпичиков по очереди: первый, второй, … (для SVG — fill, для HTML — bg) */
export const BRICK_COLORS = [
  { fill: "fill-red-600", bg: "bg-red-600" },
  { fill: "fill-accent", bg: "bg-accent" },
  { fill: "fill-sky", bg: "bg-sky" },
  { fill: "fill-paper", bg: "bg-paper" },
];

export function brickColor(index: number) {
  return BRICK_COLORS[index % BRICK_COLORS.length];
}

/** «1 кирпичик», «3 кирпичика», «5 кирпичиков» */
export function bricksLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const word =
    mod10 === 1 && mod100 !== 11
      ? "кирпичик"
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? "кирпичика"
        : "кирпичиков";
  return `${count} ${word}`;
}
