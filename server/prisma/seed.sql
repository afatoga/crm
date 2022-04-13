INSERT INTO "public"."AppUserRole" ("name") VALUES ('admin');
INSERT INTO "public"."AppUserRole" ("name") VALUES ('mod');
INSERT INTO "public"."AppUserRole" ("name") VALUES ('member');

INSERT INTO "public"."AppUserGroup" ("name", "note") VALUES ('skupina', 'test');

INSERT INTO "public"."PartyType" ("name") VALUES ('osoba');
INSERT INTO "public"."PartyType" ("name") VALUES ('organizace');

INSERT INTO "public"."Status" ("name") VALUES ('draft');
INSERT INTO "public"."Status" ("name") VALUES ('pending');
INSERT INTO "public"."Status" ("name") VALUES ('publish');