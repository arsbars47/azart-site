/**
 * Управление аккаунтами бойцов (только для админа, запускается на сервере).
 *
 *   npm run user -- create   --login ivanov --name "Иван Иванов" [--member member-5] [--password ...]
 *   npm run user -- password --login ivanov [--password ...]
 *   npm run user -- member   --login ivanov --member member-5   (или --member none — отвязать)
 *   npm run user -- list
 *   npm run user -- delete   --login ivanov
 *
 * Без --password скрипт сам придумает надёжный пароль и покажет его один раз —
 * так пароль не останется в истории команд. --member привязывает аккаунт к карточке
 * /members/<slug> из lib/data.ts: имя и цитата берутся оттуда, а цитата и кирпичики
 * из профиля показываются на этой странице.
 */
import { randomInt } from "node:crypto";
import { parseArgs } from "node:util";
import { loadEnvConfig } from "@next/env";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { members } from "../lib/data";

loadEnvConfig(process.cwd());

const LOGIN_RE = /^[a-z0-9._-]{3,32}$/;
const PASSWORD_ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    login: { type: "string" },
    name: { type: "string" },
    member: { type: "string" },
    password: { type: "string" },
  },
});
const [command] = positionals;

function fail(message: string): never {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function requireLogin(): string {
  const login = values.login?.trim().toLowerCase();
  if (!login) fail("Укажите --login");
  if (!LOGIN_RE.test(login)) fail("Логин: 3–32 символа, латиница, цифры, точка, дефис, подчёркивание");
  return login;
}

function generatePassword(length = 12): string {
  return Array.from({ length }, () => PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)]).join("");
}

function resolvePassword(): { password: string; generated: boolean } {
  if (values.password === undefined) return { password: generatePassword(), generated: true };
  if (values.password.length < 8) fail("Пароль — минимум 8 символов");
  return { password: values.password, generated: false };
}

function findMember(slug: string) {
  const member = members.find((m) => m.slug === slug);
  if (!member) fail(`Карточки ${slug} нет в lib/data.ts. Есть: ${members.map((m) => m.slug).join(", ")}`);
  return member;
}

function printCredentials(login: string, password: string, generated: boolean) {
  console.log(`  логин:  ${login}`);
  console.log(`  пароль: ${generated ? password : "(тот, что вы указали)"}`);
  if (generated) console.log("  Передайте пароль бойцу лично — повторно он не покажется.");
}

const url = process.env.DATABASE_URL;
if (!url) fail("DATABASE_URL не задан — скопируйте .env.example в .env");
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

async function main() {
  switch (command) {
    case "create": {
      const login = requireLogin();
      const member = values.member ? findMember(values.member) : undefined;
      const name = values.name?.trim() || member?.name;
      if (!name) fail("Укажите --name (или --member, чтобы взять имя из карточки)");
      if (await prisma.user.findUnique({ where: { login } })) fail(`Логин ${login} уже занят`);
      if (member && (await prisma.user.findUnique({ where: { memberSlug: member.slug } }))) {
        fail(`К карточке ${member.slug} уже привязан другой аккаунт`);
      }

      const { password, generated } = resolvePassword();
      await prisma.user.create({
        data: {
          login,
          name,
          passwordHash: await bcrypt.hash(password, 12),
          quote: member?.quote ?? "",
          memberSlug: member?.slug ?? null,
        },
      });
      console.log(`✔ Аккаунт создан: ${name}${member ? ` → /members/${member.slug}` : ""}`);
      printCredentials(login, password, generated);
      break;
    }

    case "password": {
      const login = requireLogin();
      const { password, generated } = resolvePassword();
      const { count } = await prisma.user.updateMany({
        where: { login },
        data: { passwordHash: await bcrypt.hash(password, 12) },
      });
      if (count === 0) fail(`Бойца с логином ${login} нет`);
      console.log("✔ Пароль обновлён");
      printCredentials(login, password, generated);
      break;
    }

    case "member": {
      const login = requireLogin();
      if (!values.member) fail("Укажите --member <slug> или --member none");
      const memberSlug = values.member === "none" ? null : findMember(values.member).slug;
      const { count } = await prisma.user.updateMany({ where: { login }, data: { memberSlug } });
      if (count === 0) fail(`Бойца с логином ${login} нет`);
      console.log(memberSlug ? `✔ ${login} → /members/${memberSlug}` : `✔ ${login} отвязан от карточки`);
      console.log("  Публичная страница обновится в течение часа (или сразу, как боец сохранит профиль).");
      break;
    }

    case "list": {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "asc" },
        select: { login: true, name: true, memberSlug: true, createdAt: true },
      });
      if (users.length === 0) console.log("Аккаунтов пока нет");
      for (const u of users) {
        console.log(`${u.login.padEnd(20)} ${u.name.padEnd(28)} ${(u.memberSlug ?? "—").padEnd(12)} ${u.createdAt.toLocaleDateString("ru-RU")}`);
      }
      break;
    }

    case "delete": {
      const login = requireLogin();
      const { count } = await prisma.user.deleteMany({ where: { login } });
      if (count === 0) fail(`Бойца с логином ${login} нет`);
      console.log(`✔ Аккаунт ${login} удалён — его сессии больше не действуют`);
      break;
    }

    default:
      fail("Команды: create, password, member, list, delete. Подробности — в начале scripts/user.ts");
  }
}

main()
  .catch((error) => fail(error instanceof Error ? error.message : String(error)))
  .finally(() => prisma.$disconnect());
