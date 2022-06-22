-- TYPE DICTIONARIES

INSERT INTO "public"."AppUserRole" ("name") VALUES ('ADMIN');
INSERT INTO "public"."AppUserRole" ("name") VALUES ('MOD');
INSERT INTO "public"."AppUserRole" ("name") VALUES ('MEMBER');

INSERT INTO "public"."PartyType" ("name") VALUES ('person');
INSERT INTO "public"."PartyType" ("name") VALUES ('organization');

INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ('department','o-o');
INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ('faculty','o-o');
INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ('employee','o-p');
INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ('collegue','p-p');
INSERT INTO "public"."PartyRelationshipType" ("name", "category") VALUES ('family','p-p');

INSERT INTO "public"."Status" ("name") VALUES ('draft');
INSERT INTO "public"."Status" ("name") VALUES ('published');
INSERT INTO "public"."Status" ("name") VALUES ('pending');
INSERT INTO "public"."Status" ("name") VALUES ('archive');

INSERT INTO "public"."ContactType" ("name") VALUES ('email');
INSERT INTO "public"."ContactType" ("name") VALUES ('phoneNumber');
INSERT INTO "public"."ContactType" ("name") VALUES ('website');

INSERT INTO "public"."OrganizationType" ("name") VALUES ('public');
INSERT INTO "public"."OrganizationType" ("name") VALUES ('commercial');
INSERT INTO "public"."OrganizationType" ("name") VALUES ('educational');

-- USERS & GROUPS

INSERT INTO "public"."AppUserGroup" ("name", "note") VALUES ('demo1', 'demo #1');
INSERT INTO "public"."AppUserGroup" ("name", "note") VALUES ('demo2', 'demo #2');

-- INSERT INTO "public"."AppUser" ("email", "nickname", "password") VALUES ('demotester1@email.cz', 'tester1', 'aplikace2022');
-- INSERT INTO "public"."AppUser" ("email", "nickname", "password") VALUES ('demotester2@email.cz', 'tester2', 'aplikace2022');

-- INSERT INTO "public"."AppUserGroupRelationship" ("appUserId", "appUserRoleId", "appUserGroupId") VALUES ('1', '2', '1');
-- INSERT INTO "public"."AppUserGroupRelationship" ("appUserId", "appUserRoleId", "appUserGroupId") VALUES ('2', '2', '2');