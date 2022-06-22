/*
  Warnings:

  - You are about to alter the column `email` on the `AppUser` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(254)`.
  - You are about to alter the column `name` on the `AppUserGroup` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to drop the column `post_degree` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `pre_degree` on the `Person` table. All the data in the column will be lost.
  - You are about to alter the column `surname` on the `Person` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `name` on the `Person` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - A unique constraint covering the columns `[nickname]` on the table `AppUser` will be added. If there are existing duplicate values, this will fail.
  - Made the column `appUserGroupId` on table `Party` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_appUserGroupId_fkey";

-- AlterTable
ALTER TABLE "AppUser" ADD COLUMN     "nickname" VARCHAR(60),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254);

-- AlterTable
ALTER TABLE "AppUserGroup" ALTER COLUMN "name" SET DATA TYPE VARCHAR(60);

-- AlterTable
ALTER TABLE "Party" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "appUserGroupId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "post_degree",
DROP COLUMN "pre_degree",
ADD COLUMN     "postDegree" VARCHAR(30),
ADD COLUMN     "preDegree" VARCHAR(30),
ALTER COLUMN "surname" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(120);

-- CreateTable
CREATE TABLE "Organization" (
    "partyId" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "typeId" INTEGER,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("partyId")
);

-- CreateTable
CREATE TABLE "PartyRelationship" (
    "id" SERIAL NOT NULL,
    "firstPartyId" INTEGER NOT NULL,
    "secondPartyId" INTEGER NOT NULL,
    "typeId" INTEGER,

    CONSTRAINT "PartyRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyRelationshipType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "PartyRelationshipType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "PartyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "OrganizationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_nickname_key" ON "AppUser"("nickname");

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_appUserGroupId_fkey" FOREIGN KEY ("appUserGroupId") REFERENCES "AppUserGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PartyType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "OrganizationType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyRelationship" ADD CONSTRAINT "PartyRelationship_firstPartyId_fkey" FOREIGN KEY ("firstPartyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyRelationship" ADD CONSTRAINT "PartyRelationship_secondPartyId_fkey" FOREIGN KEY ("secondPartyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyRelationship" ADD CONSTRAINT "PartyRelationship_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PartyRelationshipType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
