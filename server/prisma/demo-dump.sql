-- party --

INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (1, 1, NULL, '2022-06-22 15:28:04.569', '2022-06-22 15:28:04.57', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (2, 2, NULL, '2022-06-22 15:30:23.667', '2022-06-22 15:30:23.668', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (3, 1, NULL, '2022-06-22 15:31:31', '2022-06-22 15:31:31.001', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (4, 2, NULL, '2022-06-22 15:34:27.591', '2022-06-22 15:34:27.592', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (5, 1, NULL, '2022-06-22 15:37:01.813', '2022-06-22 15:37:01.813', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (6, 2, NULL, '2022-06-22 15:38:44.053', '2022-06-22 15:38:44.053', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (7, 1, NULL, '2022-06-22 15:39:17.437', '2022-06-22 15:39:17.438', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (8, 1, NULL, '2022-06-22 15:44:06.384', '2022-06-22 15:44:06.385', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (9, 2, NULL, '2022-06-22 15:47:24.859', '2022-06-22 15:47:24.86', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (10, 2, NULL, '2022-06-22 15:52:25.253', '2022-06-22 15:52:25.254', 1);
INSERT INTO """Party""" ("id", "typeId", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (11, 1, NULL, '2022-06-22 15:53:03.417', '2022-06-22 15:53:03.417', 1);


-- person -- 
INSERT INTO """Person""" ("partyId", "preDegree", "surname", "name", "postDegree", "birthday") VALUES (1, 'Mgr.', 'Lambert', 'Petr', '', '1988-11-12');
INSERT INTO """Person""" ("partyId", "preDegree", "surname", "name", "postDegree", "birthday") VALUES (3, '', 'Kadlecová', 'Zuzana', '', '1393-03-19');
INSERT INTO """Person""" ("partyId", "preDegree", "surname", "name", "postDegree", "birthday") VALUES (7, '', 'Hutt', 'Monica', 'PhD.', NULL);
INSERT INTO """Person""" ("partyId", "preDegree", "surname", "name", "postDegree", "birthday") VALUES (5, NULL, 'Schmidt', 'Johannes', NULL, NULL);
INSERT INTO """Person""" ("partyId", "preDegree", "surname", "name", "postDegree", "birthday") VALUES (8, '', 'Ward', 'Paul', '', NULL);
INSERT INTO """Person""" ("partyId", "preDegree", "surname", "name", "postDegree", "birthday") VALUES (11, '', 'Long', 'Justin', '', '1988-04-10');

-- organization -- 
INSERT INTO """Organization""" ("partyId", "name", "typeId") VALUES (2, 'Minimalistic Nábytek s.r.o.', NULL);
INSERT INTO """Organization""" ("partyId", "name", "typeId") VALUES (4, 'OlympIT', NULL);
INSERT INTO """Organization""" ("partyId", "name", "typeId") VALUES (6, 'Bright Analytics', NULL);
INSERT INTO """Organization""" ("partyId", "name", "typeId") VALUES (9, 'Justicix', NULL);
INSERT INTO """Organization""" ("partyId", "name", "typeId") VALUES (10, 'Modern Electronics', NULL);

-- partyrelationship --

INSERT INTO """PartyRelationship""" ("id", "firstPartyId", "secondPartyId", "firstPartyTypeId", "secondPartyTypeId", "typeId") VALUES (1, 2, 3, 2, 1, 3);
INSERT INTO """PartyRelationship""" ("id", "firstPartyId", "secondPartyId", "firstPartyTypeId", "secondPartyTypeId", "typeId") VALUES (2, 4, 5, 2, 1, 3);
INSERT INTO """PartyRelationship""" ("id", "firstPartyId", "secondPartyId", "firstPartyTypeId", "secondPartyTypeId", "typeId") VALUES (3, 6, 7, 2, 1, NULL);
INSERT INTO """PartyRelationship""" ("id", "firstPartyId", "secondPartyId", "firstPartyTypeId", "secondPartyTypeId", "typeId") VALUES (4, 6, 8, 2, 1, NULL);


-- tag --

INSERT INTO """Tag""" ("id", "name", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (1, 'veletrhNabytku2022', NULL, '2022-06-22 15:29:27.633', '2022-06-22 15:29:27.634', 1);
INSERT INTO """Tag""" ("id", "name", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (2, 'sluzebniCestaNemecko', NULL, '2022-06-22 15:40:27.296', '2022-06-22 15:40:27.297', 1);
INSERT INTO """Tag""" ("id", "name", "statusId", "createdAt", "updatedAt", "appUserGroupId") VALUES (3, 'youtubevyzva2022', NULL, '2022-06-22 15:41:54.376', '2022-06-22 15:41:54.376', 1);

-- tagparty --

INSERT INTO """TagParty""" ("partyId", "tagId") VALUES (3, 1);
INSERT INTO """TagParty""" ("partyId", "tagId") VALUES (5, 2);
INSERT INTO """TagParty""" ("partyId", "tagId") VALUES (6, 3);
INSERT INTO """TagParty""" ("partyId", "tagId") VALUES (3, 3);
INSERT INTO """TagParty""" ("partyId", "tagId") VALUES (11, 3);
INSERT INTO """TagParty""" ("partyId", "tagId") VALUES (1, 1);


-- contact -- 

INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (1, 1, 'kadlecova@minimalistic.eu', NULL, 3, 1, '2022-06-22 15:32:27.822', '2022-06-22 15:32:27.822', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (2, 2, '+38954172334', NULL, 5, NULL, '2022-06-22 15:37:42.39', '2022-06-22 15:37:50.54', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (3, 1, 'huttmonica@demotest.com', NULL, 7, NULL, '2022-06-22 15:39:57.222', '2022-06-22 15:39:57.223', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (4, 1, 'office@brightanalytics.test', NULL, 6, NULL, '2022-06-22 15:45:28.616', '2022-06-22 15:45:28.616', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (5, NULL, 'paul@brightanalytics.test', NULL, 6, 4, '2022-06-22 15:46:14.24', '2022-06-22 15:46:14.241', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (6, 1, 'justicix@justicix.test', NULL, 9, NULL, '2022-06-22 15:47:52.073', '2022-06-22 15:47:52.074', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (7, 3, 'www.justicix.test', NULL, 9, NULL, '2022-06-22 15:48:08.222', '2022-06-22 15:48:08.222', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (8, 2, '+420771321787', NULL, 9, NULL, '2022-06-22 15:48:32.105', '2022-06-22 15:48:32.105', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (9, 3, 'https://olympit.de', NULL, 4, NULL, '2022-06-22 15:49:12.315', '2022-06-22 15:49:12.316', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (10, 1, 'mail@olympit.de', NULL, 4, NULL, '2022-06-22 15:49:41.241', '2022-06-22 15:49:41.241', 1);
INSERT INTO """Contact""" ("id", "typeId", "value", "statusId", "mainPartyId", "partyRelationshipId", "createdAt", "updatedAt", "appUserGroupId") VALUES (11, NULL, 'olympit', NULL, 4, NULL, '2022-06-22 15:49:50.535', '2022-06-22 15:49:50.536', 1);
