-- TYPE DICTIONARIES

INSERT INTO "crm"."AppUserRole" ("name") VALUES ('ADMIN');
INSERT INTO "crm"."AppUserRole" ("name") VALUES ('MOD');
INSERT INTO "crm"."AppUserRole" ("name") VALUES ('MEMBER');

INSERT INTO "crm"."PartyType" ("name") VALUES ('person');
INSERT INTO "crm"."PartyType" ("name") VALUES ('organization');

INSERT INTO "crm"."PartyRelationshipType" ("name", "category") VALUES ('department','o-o');
INSERT INTO "crm"."PartyRelationshipType" ("name", "category") VALUES ('faculty','o-o');
INSERT INTO "crm"."PartyRelationshipType" ("name", "category") VALUES ('employee','o-p');
INSERT INTO "crm"."PartyRelationshipType" ("name", "category") VALUES ('collegue','p-p');
INSERT INTO "crm"."PartyRelationshipType" ("name", "category") VALUES ('family','p-p');

INSERT INTO "crm"."Status" ("name") VALUES ('draft');
INSERT INTO "crm"."Status" ("name") VALUES ('published');
INSERT INTO "crm"."Status" ("name") VALUES ('pending');
INSERT INTO "crm"."Status" ("name") VALUES ('archive');

INSERT INTO "crm"."ContactType" ("name") VALUES ('email');
INSERT INTO "crm"."ContactType" ("name") VALUES ('phoneNumber');
INSERT INTO "crm"."ContactType" ("name") VALUES ('website');

INSERT INTO "crm"."OrganizationType" ("name") VALUES ('crm');
INSERT INTO "crm"."OrganizationType" ("name") VALUES ('commercial');
INSERT INTO "crm"."OrganizationType" ("name") VALUES ('educational');

-- USERS & GROUPS

INSERT INTO "crm"."AppUserGroup" ("name", "note") VALUES ('demo1', 'demo #1');
INSERT INTO "crm"."AppUserGroup" ("name", "note") VALUES ('demo2', 'demo #2');

-- INSERT INTO "crm"."AppUser" ("email", "nickname", "password") VALUES ('demotester1@email.cz', 'tester1', 'aplikace2022');
-- INSERT INTO "crm"."AppUser" ("email", "nickname", "password") VALUES ('demotester2@email.cz', 'tester2', 'aplikace2022');

-- INSERT INTO "crm"."AppUserGroupRelationship" ("appUserId", "appUserRoleId", "appUserGroupId") VALUES ('1', '2', '1');
-- INSERT INTO "crm"."AppUserGroupRelationship" ("appUserId", "appUserRoleId", "appUserGroupId") VALUES ('2', '2', '2');