/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Config` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL DEFAULT '',
    "data" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Config" ("data", "id", "tipo") SELECT "data", "id", "tipo" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
PRAGMA foreign_key_check("Config");
PRAGMA foreign_keys=ON;
