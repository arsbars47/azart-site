import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/** Максимальная длина цитаты бойца */
export const QUOTE_MAX_LENGTH = 160;

/** Данные бойца, которые нужны страницам, — без хеша пароля */
export type Profile = {
  id: string;
  login: string;
  name: string;
  quote: string;
  bricksCount: number;
  memberSlug: string | null;
};

/**
 * Текущий боец по сессии или null. Аккаунт каждый раз проверяется по базе:
 * если админ удалил бойца, его старая cookie сразу перестаёт работать.
 * cache() — один запрос к базе на рендер, сколько бы компонентов ни спросили.
 */
export const getCurrentUser = cache(async (): Promise<Profile | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, login: true, name: true, quote: true, bricksCount: true, memberSlug: true },
  });
  return user;
});

/** Для защищённых страниц и server actions: боец или редирект на /login */
export async function requireUser(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Цитата и кирпичики для публичной страницы /members/<slug>. null — если к карточке
 * не привязан аккаунт или база недоступна (например, сборка без файла базы):
 * тогда страница показывает данные из lib/data.ts.
 */
export async function getMemberProfile(memberSlug: string): Promise<{ quote: string; bricksCount: number } | null> {
  try {
    return await prisma.user.findUnique({ where: { memberSlug }, select: { quote: true, bricksCount: true } });
  } catch (error) {
    console.error(`Не удалось прочитать профиль бойца ${memberSlug}:`, error);
    return null;
  }
}
