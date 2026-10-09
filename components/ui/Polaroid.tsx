import PhotoSlot from "@/components/ui/PhotoSlot";

type PolaroidProps = {
  /** путь к фото из photoSrc("members", slug) или null, если файла нет */
  photo: string | null;
  name: string;
  role: string;
  tilt?: "left" | "right" | "none";
  size?: "md" | "lg";
  className?: string;
};

const tilts = {
  left: "-rotate-2",
  right: "rotate-2",
  none: "",
};

/** Карточка бойца: светлая рамка полароида, квадратное фото (или заглушка с камерой) и подпись. */
export default function Polaroid({ photo, name, role, tilt = "none", size = "md", className = "" }: PolaroidProps) {
  return (
    <figure
      className={`paper-texture relative bg-paper-soft p-3 pb-4 text-navy-deep shadow-xl shadow-navy-deep/25 transition-transform duration-300 hover:rotate-0 hover:scale-[1.03] ${tilts[tilt]} ${className}`}
    >
      {/* скотч сверху */}
      <span aria-hidden className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3" />

      <PhotoSlot
        src={photo}
        alt={`${name} — ${role}`}
        sizes={size === "lg" ? "320px" : "(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"}
        fit="cover"
        className="aspect-square w-full shadow-inner"
        iconClassName={`text-white/80 ${size === "lg" ? "h-16 w-16" : "h-10 w-10"}`}
      />

      <figcaption className="mt-3 text-center font-accent leading-tight">
        <span className={`block font-bold ${size === "lg" ? "text-4xl" : "text-2xl"}`}>{name}</span>
        <span className={`block text-navy/80 ${size === "lg" ? "text-2xl" : "text-lg"}`}>{role}</span>
      </figcaption>
    </figure>
  );
}
