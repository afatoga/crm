-- CreateTable
CREATE TABLE "AppUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "appUserGroupId" INTEGER,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppUserGroup" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AppUserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" SERIAL NOT NULL,
    "typeId" INTEGER,
    "statusId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appUserGroupId" INTEGER,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "partyId" INTEGER NOT NULL,
    "pre_degree" TEXT,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "post_degree" TEXT,
    "birthday" TIMESTAMP(3),

    CONSTRAINT "Person_pkey" PRIMARY KEY ("partyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_email_key" ON "AppUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AppUserGroup_email_key" ON "AppUserGroup"("email");

-- AddForeignKey
ALTER TABLE "AppUser" ADD CONSTRAINT "AppUser_appUserGroupId_fkey" FOREIGN KEY ("appUserGroupId") REFERENCES "AppUserGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_appUserGroupId_fkey" FOREIGN KEY ("appUserGroupId") REFERENCES "AppUserGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
