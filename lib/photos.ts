import "server-only";
import fs from "node:fs";
import path from "node:path";

export type PhotoKind = "members" | "blog";

/**
 * Путь к фото по слагу — единый для всех: /images/<kind>/<slug>.jpg
 * (файлы лежат в public/images/<kind>/).
 *
 * К пути добавляется ?v=<время изменения файла>: оптимизатор next/image и браузер
 * кэшируют картинки по адресу, и без версии заменённое фото с тем же именем
 * продолжало бы показываться старым. Возвращает null, если файла нет, —
 * тогда карточка сразу рисует заглушку, без лишнего запроса.
 */
export function photoSrc(kind: PhotoKind, slug: string): string | null {
  const publicPath = `/images/${kind}/${slug}.jpg`;
  try {
    const { mtimeMs } = fs.statSync(path.join(process.cwd(), "public", publicPath));
    return `${publicPath}?v=${Math.floor(mtimeMs)}`;
  } catch {
    return null;
  }
}
