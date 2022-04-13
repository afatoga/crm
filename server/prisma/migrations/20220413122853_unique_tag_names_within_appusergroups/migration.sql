/*
  Warnings:

  - A unique constraint covering the columns `[appUserGroupId,name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tag_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Tag_appUserGroupId_name_key" ON "Tag"("appUserGroupId", "name");
