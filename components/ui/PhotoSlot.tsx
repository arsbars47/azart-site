"use client";

import Image from "next/image";
import { useState } from "react";
import { CameraIcon } from "@/components/icons";

type PhotoSlotProps = {
  /** путь к фото (из lib/photos.ts) или null, если файла нет — тогда сразу заглушка */
  src: string | null;
  alt: string;
  /** подсказка браузеру, какой ширины будет фото, — чтобы next/image отдал файл нужного размера */
  sizes: string;
  /**
   * cover — фото заполняет область и обрезается по центру (полароиды бойцов);
   * contain — фото видно целиком, свободные поля залиты фоном `matteClassName` (новости).
   */
  fit?: "cover" | "contain";
  /** размеры/пропорции области, например `aspect-square w-full` */
  className?: string;
  /** фон полей вокруг фото при fit="contain" */
  matteClassName?: string;
  iconClassName?: string;
  /** отдать картинку как есть, без оптимизатора next/image — для внешних CDN (фото из ВК) */
  unoptimized?: boolean;
};

/**
 * Область под фото с запасным вариантом: пока фото грузится, если файла нет
 * (src === null) или он не открылся (onError убирает <Image>), видна синяя заглушка с камерой.
 */
export default function PhotoSlot({
  src,
  alt,
  sizes,
  fit = "cover",
  className = "",
  matteClassName = "bg-navy-deep",
  iconClassName = "h-10 w-10 text-white/80",
  unoptimized = false,
}: PhotoSlotProps) {
  // результат запоминаем вместе с src: если адрес сменился (фото заменили), статус снова «loading»
  const [result, setResult] = useState<{ src: string; ok: boolean } | null>(null);
  const status = !src ? "failed" : result?.src !== src ? "loading" : result.ok ? "loaded" : "failed";
  const loaded = status === "loaded";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        loaded ? matteClassName : "photo-placeholder"
      } ${className}`}
    >
      {!loaded && <CameraIcon className={iconClassName} />}
      {src && status !== "failed" && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized={unoptimized}
          onLoad={() => setResult({ src, ok: true })}
          onError={() => setResult({ src, ok: false })}
          // прозрачно до загрузки: значок «битой» картинки не мелькает, фото плавно проявляется
          className={`h-full w-full transition-opacity duration-300 ${
            fit === "contain" ? "object-contain" : "object-cover object-center"
          } ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
