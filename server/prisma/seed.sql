INSERT INTO "public"."AppUserRole" ("name") VALUES ("admin");
INSERT INTO "public"."AppUserRole" ("name") VALUES ("mod");
INSERT INTO "public"."AppUserRole" ("name") VALUES ("member");

INSERT INTO "public"."PartyType" ("name") VALUES ("person");
INSERT INTO "public"."PartyType" ("name") VALUES ("organization");

INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ("department","o-o");
INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ("faculty","o-o");
INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ("employee","o-p");
INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ("collegue","p-p");
INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ("family","p-p");

INSERT INTO "public"."Status" ("name") VALUES ("draft");
INSERT INTO "public"."Status" ("name") VALUES ("published");
INSERT INTO "public"."Status" ("name") VALUES ("pending");
INSERT INTO "public"."Status" ("name") VALUES ("archive");

INSERT INTO "public"."ContactType" ("name") VALUES ("email");
INSERT INTO "public"."ContactType" ("name") VALUES ("phoneNumber");
INSERT INTO "public"."ContactType" ("name") VALUES ("website");

INSERT INTO "public"."OrganizationType" ("name") VALUES ("public");
INSERT INTO "public"."OrganizationType" ("name") VALUES ("commercial");
INSERT INTO "public"."OrganizationType" ("name") VALUES ("educational");

INSERT INTO "public"."AppUserGroup" ("name", "note") VALUES ("demo1", "demo scenar #1");
INSERT INTO "public"."AppUserGroup" ("name", "note") VALUES ("demo2", "demo scenar #2");