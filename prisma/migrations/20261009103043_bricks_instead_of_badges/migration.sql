-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "login" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "quote" TEXT NOT NULL DEFAULT '',
    "bricksCount" INTEGER NOT NULL DEFAULT 0,
    "memberSlug" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "login", "memberSlug", "name", "passwordHash", "quote", "updatedAt") SELECT "createdAt", "id", "login", "memberSlug", "name", "passwordHash", "quote", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
CREATE UNIQUE INDEX "User_memberSlug_key" ON "User"("memberSlug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

