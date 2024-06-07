/*
  Warnings:

  - You are about to drop the `_ClientsToTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_ClientsToTags_B_index";

-- DropIndex
DROP INDEX "_ClientsToTags_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ClientsToTags";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "adesao" TEXT NOT NULL,
    "plano" TEXT NOT NULL,
    "limite" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Clients" ("adesao", "createdAt", "email", "empresa", "id", "limite", "name", "password", "plano", "status", "username") SELECT "adesao", "createdAt", "email", "empresa", "id", "limite", "name", "password", "plano", "status", "username" FROM "Clients";
DROP TABLE "Clients";
ALTER TABLE "new_Clients" RENAME TO "Clients";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
