import "server-only";

/**
 * Защита от перебора паролей: после 5 неудачных попыток подряд логин блокируется
 * на 15 минут. Счётчики живут в памяти процесса — этого хватает, пока сайт
 * работает одним процессом PM2 (instances: 1); после перезапуска они обнуляются.
 */
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
/** выше этого числа записей выкидываем незаблокированные — чтобы перебор случайных логинов не раздувал память */
const MAX_ENTRIES = 1000;

type Entry = { failures: number; lockedUntil: number };

// общий Map на процесс: модуль может загружаться отдельно для разных маршрутов
const globalForLimiter = globalThis as unknown as { loginAttempts?: Map<string, Entry> };
const attempts = (globalForLimiter.loginAttempts ??= new Map<string, Entry>());

/** Сколько минут логин ещё заблокирован (0 — не заблокирован) */
export function lockedMinutes(login: string): number {
  const entry = attempts.get(login);
  if (!entry || entry.lockedUntil <= Date.now()) return 0;
  return Math.ceil((entry.lockedUntil - Date.now()) / 60_000);
}

export function registerFailure(login: string) {
  if (attempts.size >= MAX_ENTRIES) {
    for (const [key, entry] of attempts) if (entry.lockedUntil <= Date.now()) attempts.delete(key);
  }
  const entry = attempts.get(login) ?? { failures: 0, lockedUntil: 0 };
  entry.failures += 1;
  if (entry.failures >= MAX_FAILURES) {
    entry.failures = 0;
    entry.lockedUntil = Date.now() + LOCK_MS;
  }
  attempts.set(login, entry);
}

export function clearFailures(login: string) {
  attempts.delete(login);
}
