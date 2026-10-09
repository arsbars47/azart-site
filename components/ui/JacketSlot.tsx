import Jacket from "@/components/jacket/Jacket";
import { brickColor, bricksLabel } from "@/lib/bricks";

type JacketSlotProps = {
  /** кирпичики на воротнике — боец отмечает их в /profile */
  bricks: number;
};

/** Бойцовка на публичной странице бойца — только просмотр, редактирование в /profile. */
export default function JacketSlot({ bricks }: JacketSlotProps) {
  return (
    <section aria-labelledby="jacket-title" className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
      <div>
        <h2 id="jacket-title" className="font-sans text-sm font-bold uppercase tracking-[0.25em] text-navy">
          Бойцовка
        </h2>
        <Jacket className="mt-4" bricks={bricks} />
      </div>

      <div>
        <h2 className="font-sans text-sm font-bold uppercase tracking-[0.25em] text-navy">На воротнике</h2>
        {bricks > 0 ? (
          <>
            <ul aria-hidden className="mt-4 flex flex-wrap gap-1.5">
              {Array.from({ length: bricks }, (_, i) => (
                <li key={i} className={`h-3 w-7 rounded-[2px] border border-navy-deep/40 ${brickColor(i).bg}`} />
              ))}
            </ul>
            <p className="mt-3 text-lg font-medium text-navy-deep">
              {bricksLabel(bricks)} — по одному за каждую отработанную целину
            </p>
          </>
        ) : (
          <p className="mt-4 font-accent text-xl text-navy-deep/70">кирпичиков пока нет — но целина впереди</p>
        )}
      </div>
    </section>
  );
}
