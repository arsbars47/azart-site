import { loadEnvConfig } from "@next/env";
import { defineConfig, env } from "prisma/config";

// .env-файлы читаем так же, как их читает Next.js, — одна настройка на сайт и Prisma CLI
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
