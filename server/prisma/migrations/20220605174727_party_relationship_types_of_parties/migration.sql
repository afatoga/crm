/*
  Warnings:

  - Added the required column `firstPartyTypeId` to the `PartyRelationship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondPartyTypeId` to the `PartyRelationship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PartyRelationship" ADD COLUMN     "firstPartyTypeId" INTEGER NOT NULL,
ADD COLUMN     "secondPartyTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PartyRelationshipType" ADD COLUMN     "category" VARCHAR(16);

-- AddForeignKey
ALTER TABLE "PartyRelationship" ADD CONSTRAINT "PartyRelationship_firstPartyTypeId_fkey" FOREIGN KEY ("firstPartyTypeId") REFERENCES "PartyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyRelationship" ADD CONSTRAINT "PartyRelationship_secondPartyTypeId_fkey" FOREIGN KEY ("secondPartyTypeId") REFERENCES "PartyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
