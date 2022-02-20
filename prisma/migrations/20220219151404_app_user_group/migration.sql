/*
  Warnings:

  - You are about to drop the column `count` on the `AppUserGroup` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `AppUserGroup` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `AppUserGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `AppUserGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AppUserGroup_email_key";

-- AlterTable
ALTER TABLE "AppUserGroup" DROP COLUMN "count",
DROP COLUMN "email",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "note" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AppUserGroup_name_key" ON "AppUserGroup"("name");
