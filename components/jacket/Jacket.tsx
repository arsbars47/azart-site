import { brickColor, bricksLabel, MAX_BRICKS } from "@/lib/bricks";

/*
 * Виртуальная бойцовка — рабочая куртка цвета хаки (viewBox 400×440).
 * Компонент без состояния: работает и в серверных, и в клиентских компонентах.
 *
 * Лево/право ниже — как на экране. Правый рукав бойца нарисован слева, левый — справа.
 */

type Chevron = {
  label: string;
  cx: number;
  cy: number;
  shape: "circle" | "shield";
  /** наклон вдоль рукава, градусы */
  tilt: number;
  /** фон и ободок */
  body: string;
  /** цвет и шрифт надписи */
  text: string;
  /** тонкий внутренний ободок */
  ring: string;
  fontSize: number;
};

/** Шевроны есть у всех бойцов — они часть рисунка, в базе не хранятся */
const CHEVRONS: Chevron[] = [
  // правый рукав бойца
  { label: "Штаб", cx: 63, cy: 132, shape: "shield", tilt: 8, body: "fill-navy stroke-paper-soft", text: "fill-paper-soft font-sans font-extrabold", ring: "stroke-paper-soft/50", fontSize: 9.5 },
  { label: "Азарт", cx: 57, cy: 192, shape: "circle", tilt: 8, body: "fill-accent stroke-paper-soft", text: "fill-navy-deep font-display", ring: "stroke-navy-deep/45", fontSize: 10 },
  // левый рукав бойца
  { label: "РСО", cx: 337, cy: 132, shape: "circle", tilt: -8, body: "fill-red-600 stroke-paper-soft", text: "fill-white font-sans font-extrabold", ring: "stroke-white/50", fontSize: 12 },
  { label: "НРО", cx: 343, cy: 192, shape: "shield", tilt: -8, body: "fill-paper-soft stroke-red-600", text: "fill-navy-deep font-sans font-extrabold", ring: "stroke-red-600/55", fontSize: 11.5 },
];

/**
 * Места под кирпичики — центры прямоугольников 14×6 на крыльях воротника.
 * Порядок заполнения слева направо: левое крыло сверху вниз, затем правое снизу вверх.
 */
const LEFT_WING = [
  { x: 146, y: 58 },
  { x: 152, y: 67 },
  { x: 158, y: 76 },
  { x: 164, y: 85 },
];
const BRICK_SLOTS = [...LEFT_WING, ...[...LEFT_WING].reverse().map(({ x, y }) => ({ x: 400 - x, y }))];

const BUTTONS_Y = [72, 128, 184, 240, 296, 352];

/** Точка на квадратичной кривой Безье — для складок резинки */
function quad(t: number, p0: number[], p1: number[], p2: number[]) {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * p0[i] + 2 * u * t * p1[i] + t * t * p2[i]);
}

/** Складки резинки на поясе: от верхнего края пояса к нижнему */
const WAIST_GATHERS = Array.from({ length: 17 }, (_, i) => {
  const t = (i + 1) / 18;
  const [x1, y1] = quad(t, [88, 400], [200, 414], [312, 400]);
  const [x2, y2] = quad(t, [87, 428], [200, 442], [313, 428]);
  return `M${x1.toFixed(1)} ${(y1 + 2).toFixed(1)}L${x2.toFixed(1)} ${(y2 - 2).toFixed(1)}`;
}).join("");

/** Складки на манжетах (левая манжета — от отрезка (10,326)-(62,340) вниз; правая — зеркально) */
const CUFF_GATHERS = [0.2, 0.4, 0.6, 0.8]
  .flatMap((t) => {
    const [x, y] = [10 + 52 * t, 326 + 14 * t];
    return [`M${x} ${y + 2}l-4 18`, `M${400 - x} ${y + 2}l4 18`];
  })
  .join("");

/** Щит 38×44 с острым низом; (cx, cy) — чуть выше середины */
function shieldPath(cx: number, cy: number) {
  return `M${cx - 19} ${cy - 20}h38v19q0 16-19 25q-19-9-19-25Z`;
}

function ChevronPatch({ chevron: c }: { chevron: Chevron }) {
  const label = c.label.toUpperCase();
  return (
    <g transform={`rotate(${c.tilt} ${c.cx} ${c.cy})`}>
      {c.shape === "circle" ? (
        <>
          <circle cx={c.cx} cy={c.cy} r="20" className={c.body} strokeWidth="2.5" />
          <circle cx={c.cx} cy={c.cy} r="15.5" fill="none" className={c.ring} strokeWidth="0.8" />
        </>
      ) : (
        <>
          <path d={shieldPath(c.cx, c.cy)} className={c.body} strokeWidth="2.2" strokeLinejoin="round" />
          {/* внутренний контур — тот же щит, уменьшенный к центру */}
          <path
            d={shieldPath(c.cx, c.cy)}
            transform={`translate(${c.cx} ${c.cy + 2}) scale(0.8) translate(${-c.cx} ${-c.cy - 2})`}
            fill="none"
            className={c.ring}
            strokeWidth="1"
          />
        </>
      )}
      <text
        x={c.cx}
        y={c.shape === "circle" ? c.cy + c.fontSize * 0.36 : c.cy + 2}
        textAnchor="middle"
        fontSize={c.fontSize}
        // длинные надписи ужимаем по ширине, чтобы они точно влезли в шеврон
        textLength={label.length >= 4 ? 28 : undefined}
        lengthAdjust="spacingAndGlyphs"
        className={c.text}
      >
        {label}
      </text>
    </g>
  );
}

type JacketProps = {
  /** сколько кирпичиков на воротнике (лишние сверх MAX_BRICKS не рисуются) */
  bricks: number;
  className?: string;
};

export default function Jacket({ bricks, className = "" }: JacketProps) {
  const shown = Math.max(0, Math.min(bricks, MAX_BRICKS));

  return (
    <svg
      viewBox="0 0 400 440"
      role="img"
      aria-label={`Бойцовка: шевроны ${CHEVRONS.map((c) => c.label).join(", ")}; на воротнике ${bricksLabel(shown)}`}
      className={`mx-auto block aspect-[10/11] w-full max-w-md drop-shadow-[0_14px_18px_rgb(27_53_102/0.35)] ${className}`}
    >
      {/* рукава */}
      <path d="M92 68 52 86q-16 12-20 42L10 326l52 14 34-160Z" className="fill-jacket stroke-jacket-deep" strokeWidth="3" strokeLinejoin="round" />
      <path d="m308 68 40 18q16 12 20 42l22 198-52 14-34-160Z" className="fill-jacket stroke-jacket-deep" strokeWidth="3" strokeLinejoin="round" />
      {/* манжеты на резинке */}
      <path d="M10 326 62 340l-4 22-52-14Zm380 0-52 14 4 22 52-14Z" className="fill-jacket stroke-jacket-deep" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={CUFF_GATHERS} className="stroke-jacket-deep/70" strokeWidth="1.2" strokeLinecap="round" />

      {/* шевроны на рукавах */}
      {CHEVRONS.map((c) => (
        <ChevronPatch key={c.label} chevron={c} />
      ))}

      {/* корпус */}
      <path
        d="M160 40 92 68l4 110-8 230q112 14 224 0l-8-230 4-110-68-28q-40 22-80 0Z"
        className="fill-jacket stroke-jacket-deep"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* проймы */}
      <path d="M96 180q-6-60-4-112M304 180q6-60 4-112" fill="none" className="stroke-jacket-deep/70" strokeWidth="2" />

      {/* нагрудные карманы с клапанами */}
      <path d="M112 140h64v58h-64Zm112 0h64v58h-64Z" className="fill-jacket stroke-jacket-deep" strokeWidth="2" strokeLinejoin="round" />
      <path d="M116 152v42h56v-42m52 0v42h56v-42" fill="none" className="stroke-jacket-light/60" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M108 128h72v20l-36 8-36-8Zm112 0h72v20l-36 8-36-8Z" className="fill-jacket stroke-jacket-deep" strokeWidth="2" strokeLinejoin="round" />
      <path d="M112 132h64v13l-32 7-32-7Zm112 0h64v13l-32 7-32-7Z" fill="none" className="stroke-jacket-light/60" strokeWidth="1" strokeDasharray="3 2" />

      {/* планка застёжки */}
      <path d="M206 62v342" className="stroke-jacket-deep" strokeWidth="1.8" />
      <path d="M210 66v336" className="stroke-jacket-light/50" strokeWidth="1" strokeDasharray="3 2" />

      {/* пояс на резинке */}
      <path d="M88 400q112 14 224 0l1 28q-113 14-226 0Z" className="fill-jacket stroke-jacket-deep" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={WAIST_GATHERS} className="stroke-jacket-deep/60" strokeWidth="1.2" strokeLinecap="round" />

      {/* пуговицы: застёжка, клапаны карманов, пояс */}
      {[...BUTTONS_Y.map((y) => ({ x: 200, y })), { x: 144, y: 150 }, { x: 256, y: 150 }, { x: 200, y: 421 }].map((b) => (
        <g key={`${b.x}-${b.y}`}>
          <circle cx={b.x} cy={b.y} r="4.4" className="fill-jacket-light stroke-jacket-deep" strokeWidth="1.4" />
          <circle cx={b.x} cy={b.y} r="1.6" className="fill-jacket-deep/50" />
        </g>
      ))}

      {/* отложной воротник: изнанка, крылья, строчка */}
      <path d="M162 34q38-16 76 0q-22 10-36 28h-4q-14-18-36-28Z" className="fill-jacket-deep" />
      <path
        d="M162 34 124 56q16 26 42 48l32-42q-14-18-36-28Zm76 0 38 22q-16 26-42 48l-32-42q14-18 36-28Z"
        className="fill-jacket stroke-jacket-deep"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M159 38.5 130 56q14 23 36 42M241 38.5 270 56q-14 23-36 42" fill="none" className="stroke-jacket-light/60" strokeWidth="1" strokeDasharray="3 2" />

      {/* кирпичики на воротнике */}
      {BRICK_SLOTS.slice(0, shown).map(({ x, y }, i) => (
        <g key={i}>
          <rect x={x - 7} y={y - 3} width="14" height="6" rx="1" className={`${brickColor(i).fill} stroke-jacket-deep`} strokeWidth="0.9" />
          <path d={`M${x - 5.5} ${y - 1.5}h11`} className="stroke-white/60" strokeWidth="0.8" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}
