import "server-only";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан — скопируйте .env.example в .env");
  // путь к файлу SQLite считается от корня проекта (process.cwd())
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}

// В dev горячая перезагрузка заново выполняет модуль — держим один клиент на процесс,
// чтобы не открывать файл базы при каждом сохранении кода
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
