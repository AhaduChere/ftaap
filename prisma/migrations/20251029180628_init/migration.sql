/*
  Warnings:

  - You are about to drop the column `dibel_score` on the `Student` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "t_id" INTEGER NOT NULL,
    CONSTRAINT "Student_t_id_fkey" FOREIGN KEY ("t_id") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("first_name", "id", "last_name", "t_id") SELECT "first_name", "id", "last_name", "t_id" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
