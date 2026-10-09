"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { lockedMinutes } from "@/lib/login-limiter";

/** error — текст ошибки; login — чтобы после неудачной попытки не вводить логин заново */
export type LoginState = { error: string; login: string } | undefined;

export async function authenticate(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const login = String(formData.get("login") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!login || !password) return { error: "Введите логин и пароль", login };

  const minutes = lockedMinutes(login);
  if (minutes > 0) return { error: `Слишком много неудачных попыток. Попробуйте через ${minutes} мин.`, login };

  try {
    // при успехе signIn ставит cookie сессии и бросает redirect — его не перехватываем
    await signIn("credentials", { login, password, redirectTo: "/profile" });
  } catch (error) {
    if (error instanceof AuthError) {
      const message =
        error.type === "CredentialsSignin" ? "Неверный логин или пароль" : "Не получилось войти, попробуйте ещё раз";
      return { error: message, login };
    }
    throw error;
  }
}
