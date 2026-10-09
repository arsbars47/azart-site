import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { clearFailures, lockedMinutes, registerFailure } from "@/lib/login-limiter";

// bcrypt-хеш случайной строки: для несуществующего логина всё равно сверяем пароль,
// чтобы по времени ответа нельзя было понять, есть такой логин или нет
const DUMMY_HASH = "$2b$12$c.oEbVhOzVqwv8qcMVWQa.Ovzo2WrhuhBmK0tceG1yHrk7sFImtba";

/**
 * Вход по логину и паролю (Auth.js v5). Регистрации нет — аккаунты создаёт админ
 * скриптом scripts/user.ts. Сессия — подписанный JWT в httpOnly-cookie (ключ AUTH_SECRET).
 * Вход и выход идут через server actions (app/login, app/profile), поэтому
 * отдельный маршрут /api/auth не нужен.
 */
export const { auth, signIn, signOut } = NextAuth({
  // сайт стоит за nginx: адрес и протокол Auth.js берёт из заголовков прокси
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { login: {}, password: {} },
      async authorize(credentials) {
        const login = typeof credentials.login === "string" ? credentials.login.trim().toLowerCase() : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";
        if (!login || !password || lockedMinutes(login) > 0) return null;

        const user = await prisma.user.findUnique({
          where: { login },
          select: { id: true, name: true, passwordHash: true },
        });
        const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !valid) {
          registerFailure(login);
          return null;
        }

        clearFailures(login);
        return { id: user.id, name: user.name };
      },
    }),
  ],
  logger: {
    // неверный пароль — обычная ситуация, а не ошибка сервера: не засоряем логи PM2
    error(error) {
      if (error instanceof CredentialsSignin) return;
      console.error("[auth]", error);
    },
  },
  callbacks: {
    // id бойца лежит в token.sub — прокидываем его в session.user.id
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
