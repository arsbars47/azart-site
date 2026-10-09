"use server";

import { revalidatePath } from "next/cache";
import { signOut } from "@/auth";
import { MAX_BRICKS } from "@/lib/bricks";
import { prisma } from "@/lib/db";
import { QUOTE_MAX_LENGTH, requireUser } from "@/lib/users";

// Server actions — публичные эндпоинты: каждая сама проверяет сессию через requireUser()
// и меняет только аккаунт вошедшего бойца.

/** Обновить /profile и публичную страницу бойца (она статическая и сама не пересоберётся) */
function revalidateProfile(memberSlug: string | null) {
  revalidatePath("/profile");
  if (memberSlug) revalidatePath(`/members/${memberSlug}`);
}

export type QuoteState = { ok: boolean; message: string } | null;

export async function updateQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const user = await requireUser();
  const quote = String(formData.get("quote") ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (quote.length > QUOTE_MAX_LENGTH) {
    return { ok: false, message: `Цитата длиннее ${QUOTE_MAX_LENGTH} символов` };
  }

  await prisma.user.update({ where: { id: user.id }, data: { quote } });
  revalidateProfile(user.memberSlug);
  return { ok: true, message: quote ? "Цитата сохранена" : "Цитата удалена" };
}

/** Сохранить число кирпичиков на воротнике — клиент присылает итоговое значение */
export async function saveBricks(count: number): Promise<{ error?: string }> {
  const user = await requireUser();
  if (!Number.isInteger(count) || count < 0 || count > MAX_BRICKS) {
    return { error: `Кирпичиков может быть от 0 до ${MAX_BRICKS}` };
  }

  await prisma.user.update({ where: { id: user.id }, data: { bricksCount: count } });
  revalidateProfile(user.memberSlug);
  return {};
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
