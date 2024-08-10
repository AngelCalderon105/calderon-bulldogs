/*
  Warnings:

  - You are about to drop the column `salt` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_salt_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "salt";
