/*
  Warnings:

  - You are about to drop the column `tags` on the `Reports` table. All the data in the column will be lost.
  - Added the required column `tag` to the `Reports` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Reports" ("createdAt", "desc", "file", "id", "month", "name", "year") SELECT "createdAt", "desc", "file", "id", "month", "name", "year" FROM "Reports";
DROP TABLE "Reports";
ALTER TABLE "new_Reports" RENAME TO "Reports";
CREATE TABLE "new_Config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL DEFAULT '',
    "data" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Config" ("createdAt", "data", "id") SELECT "createdAt", "data", "id" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
PRAGMA foreign_key_check("Reports");
PRAGMA foreign_key_check("Config");
PRAGMA foreign_keys=ON;
