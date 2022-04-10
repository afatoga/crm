/*
  Warnings:

  - You are about to drop the column `appUserGroupId` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `firstPartyId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `secondPartyId` on the `Contact` table. All the data in the column will be lost.
  - The primary key for the `NoteParty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `NoteParty` table. All the data in the column will be lost.
  - The primary key for the `NoteTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `NoteTag` table. All the data in the column will be lost.
  - The primary key for the `TagParty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TagParty` table. All the data in the column will be lost.
  - Added the required column `password` to the `AppUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppUser" DROP CONSTRAINT "AppUser_appUserGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_firstPartyId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_secondPartyId_fkey";

-- AlterTable
ALTER TABLE "AppUser" DROP COLUMN "appUserGroupId",
ADD COLUMN     "password" VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "firstPartyId",
DROP COLUMN "secondPartyId",
ADD COLUMN     "partyRelationshipId" INTEGER;

-- AlterTable
ALTER TABLE "NoteParty" DROP CONSTRAINT "NoteParty_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "NoteParty_pkey" PRIMARY KEY ("partyId", "noteId");

-- AlterTable
ALTER TABLE "NoteTag" DROP CONSTRAINT "NoteTag_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("tagId", "noteId");

-- AlterTable
ALTER TABLE "TagParty" DROP CONSTRAINT "TagParty_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "TagParty_pkey" PRIMARY KEY ("partyId", "tagId");

-- CreateTable
CREATE TABLE "AppUserRole" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(16) NOT NULL,

    CONSTRAINT "AppUserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppUserGroupRelationship" (
    "appUserId" INTEGER NOT NULL,
    "appUserRoleId" INTEGER NOT NULL,
    "appUserGroupId" INTEGER NOT NULL,

    CONSTRAINT "AppUserGroupRelationship_pkey" PRIMARY KEY ("appUserId","appUserRoleId","appUserGroupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUserRole_name_key" ON "AppUserRole"("name");

-- AddForeignKey
ALTER TABLE "AppUserGroupRelationship" ADD CONSTRAINT "AppUserGroupRelationship_appUserId_fkey" FOREIGN KEY ("appUserId") REFERENCES "AppUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppUserGroupRelationship" ADD CONSTRAINT "AppUserGroupRelationship_appUserRoleId_fkey" FOREIGN KEY ("appUserRoleId") REFERENCES "AppUserRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppUserGroupRelationship" ADD CONSTRAINT "AppUserGroupRelationship_appUserGroupId_fkey" FOREIGN KEY ("appUserGroupId") REFERENCES "AppUserGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_partyRelationshipId_fkey" FOREIGN KEY ("partyRelationshipId") REFERENCES "PartyRelationship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
