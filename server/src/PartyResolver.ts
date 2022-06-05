import "reflect-metadata";
import {
  //ArgsType,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  Authorized,
  Int,
  ID,
} from "type-graphql";
import {
  Party,
  Person,
  ExtendedPerson,
  ExtendedOrganization,
  Organization,
  PartyWithName,
  PartyRelationship,
  ExtendedPartyRelationship,
  PartyRelationshipType,
} from "./Party";
import { Context } from "./context";
import { Prisma } from "@prisma/client";
import { isUserAuthorized } from "./authChecker";
import { APIResponse } from "./GlobalObjects";
//import { Service } from 'typedi'

@InputType()
class PersonInput {
  @Field((type) => Int, { nullable: true })
  partyId: number;

  // @Field({ nullable: true })
  // typeId: number;

  @Field((type) => Int, { nullable: true })
  statusId: number;

  @Field({ nullable: true })
  preDegree: string;

  @Field()
  name: string;

  @Field()
  surname: string;

  @Field({ nullable: true })
  postDegree: string;

  @Field({ nullable: true })
  birthday: Date; //Date?

  @Field((type) => Int, { nullable: true })
  appUserGroupId: number;
}

@InputType()
class DeletePersonInput {
  @Field((type) => Int)
  partyId: number;

  @Field((type) => Int)
  appUserGroupId: number;
}

@InputType()
class OrganizationInput {
  @Field({ nullable: true })
  partyId: number;

  @Field({ nullable: true })
  statusId: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  organizationTypeId: number;

  @Field({ nullable: true })
  appUserGroupId: number;
}

@InputType()
class PartyRelationshipInput {
  @Field((type) => Int, { nullable: true })
  firstPartyId: number;

  @Field((type) => Int, { nullable: true })
  secondPartyId: number;

  @Field((type) => Int, { nullable: true })
  typeId: number;
}

@InputType()
class PartyByNameInput {
  @Field()
  searchedName: string;

  @Field((type) => Int)
  appUserGroupId: number;

  @Field((type) => Int, { nullable: true })
  statusId: number;
}

@InputType()
class UpdatePartyRelationshipInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  firstPartyId: number;

  @Field({ nullable: true })
  secondPartyId: number;

  @Field({ nullable: true })
  typeId: number;
}

@InputType()
class PartyByAppUserGroupInput {
  @Field((type) => Int)
  appUserGroupId: number;

  @Field({ nullable: true })
  partyTypeId: number;

  @Field((type) => Int, { nullable: true })
  id: number;

  @Field((type) => Int, { nullable: true })
  statusId: number;
}

//@Service()
@Resolver(Party)
export class PartyResolver {
  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => Person)
  async createPerson(
    @Arg("data") data: PersonInput,
    @Ctx() ctx: Context
  ): Promise<Person> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    const party = await ctx.prisma.party.create({
      data: {
        typeId: 1,
        statusId: data.statusId && data.statusId,
        appUserGroupId: data.appUserGroupId,
      },
    });

    return await ctx.prisma.person.create({
      data: {
        partyId: party.id,
        preDegree: data?.preDegree,
        name: data.name,
        surname: data.surname,
        postDegree: data?.postDegree,
        birthday: data?.birthday,
      },
    });
  }
  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => Person)
  async updatePerson(
    @Arg("data") data: PersonInput,
    @Ctx() ctx: Context
  ): Promise<Person> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    if (data.statusId)
      await ctx.prisma.party.update({
        where: {
          id: data.partyId,
        },
        data: {
          statusId: data.statusId,
        },
      });

    //update
    return await ctx.prisma.person.update({
      where: {
        partyId: data.partyId,
      },
      data: {
        preDegree: data?.preDegree,
        name: data.name,
        surname: data.surname,
        postDegree: data?.postDegree,
        birthday: data?.birthday,
      },
    });
  }

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => APIResponse)
  async deletePerson(
    @Arg("data") data: DeletePersonInput,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    await ctx.prisma.party.update({
      where: {
        id: data.partyId,
      },
      data: {
        statusId: 4, //archive CONST
      },
    });

    return {
      status: "SUCCESS",
      message: "person was archived",
    };
  }

  @Query(() => [Person])
  async allPersons(@Ctx() ctx: Context) {
    return ctx.prisma.person.findMany();
  }

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => Organization)
  async createUpdateOrganization(
    @Arg("data") data: OrganizationInput,
    @Ctx() ctx: Context
  ): Promise<Organization> {
    if (!ctx.currentUser) throw new Error();

    if (data.partyId) {
      //update
      return ctx.prisma.organization.update({
        where: {
          partyId: data.partyId,
        },
        data: {
          name: data.name,
          typeId: data?.organizationTypeId,
        },
      });
    }

    //create
    const party = await ctx.prisma.party.create({
      data: {
        typeId: 2,
        appUserGroupId: ctx.currentUser.currentAppUserGroupId,
      },
    });

    return ctx.prisma.organization.create({
      data: {
        partyId: party.id,
        name: data.name,
        typeId: data?.organizationTypeId,
      },
    });
  }

  @Query(() => [Person])
  async allOrganizations(@Ctx() ctx: Context) {
    return ctx.prisma.organization.findMany();
  }

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => PartyRelationship)
  async createPartyRelationship(
    @Arg("data") data: PartyRelationshipInput,
    @Ctx() ctx: Context
  ): Promise<PartyRelationship> {
    if (!ctx.currentUser) throw new Error("Only for logged in users");
    if (data.firstPartyId === data.secondPartyId)
      throw new Error("use two different parties");

    if (!data.firstPartyId || !data.firstPartyId)
      throw new Error("provide first and second party");

    const relationshipExist = await ctx.prisma.partyRelationship.findFirst({
      where: {
        firstPartyId: data.firstPartyId,
        secondPartyId: data.secondPartyId,
        typeId: data.typeId,
      },
    });

    if (relationshipExist) throw new Error("relationship exist");

    const firstParty = await ctx.prisma.party.findFirst({
      where: {
        id: data.firstPartyId,
        appUserGroupId: ctx.currentUser.currentAppUserGroupId,
      },
    });

    const secondParty = await ctx.prisma.party.findFirst({
      where: {
        id: data.secondPartyId,
        appUserGroupId: ctx.currentUser.currentAppUserGroupId,
      },
    });

    if (!firstParty || !secondParty || firstParty.id === secondParty.id)
      throw new Error("first or second party invalid");

    return await ctx.prisma.partyRelationship.create({
      data: {
        typeId: data.typeId,
        firstPartyId: firstParty.id,
        secondPartyId: secondParty.id,
      },
    });
  }

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => PartyRelationship)
  async updatePartyRelationship(
    @Arg("data") data: UpdatePartyRelationshipInput,
    @Ctx() ctx: Context
  ): Promise<PartyRelationship> {
    // if (!data.operation) throw new Error("Invalid");
    if (!ctx.currentUser) throw new Error("Only for logged in users");
    if (data.firstPartyId === data.secondPartyId)
      throw new Error("use two different parties");

    // if (data.operation === "CREATE") {

    // }

    if (!data.id) throw new Error("provide id to update");
    const existingRelationship = await ctx.prisma.partyRelationship.findFirst({
      where: {
        firstPartyId: data.firstPartyId,
        secondPartyId: data.secondPartyId,
        typeId: data.typeId,
      },
    });

    if (existingRelationship) throw new Error("relationship already exists");

    const firstParty = await ctx.prisma.party.findFirst({
      where: {
        id: data.firstPartyId,
        appUserGroupId: ctx.currentUser.currentAppUserGroupId,
      },
    });

    const secondParty = await ctx.prisma.party.findFirst({
      where: {
        id: data.secondPartyId,
        appUserGroupId: ctx.currentUser.currentAppUserGroupId,
      },
    });
    if (!firstParty || !secondParty || firstParty.id === secondParty.id)
      throw new Error("first or second party invalid");

    return await ctx.prisma.partyRelationship.update({
      where: {
        id: data.id,
      },
      data: {
        typeId: data.typeId && data.typeId,
        firstPartyId: firstParty.id,
        secondPartyId: secondParty.id,
      },
    });
  }
  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => APIResponse)
  async deletePartyRelationship(
    @Arg("id") id: number,
    @Arg("appUserGroupId") appUserGroupId: number,
    @Ctx() ctx: Context
  ): Promise<APIResponse> {
    // if (!data.operation) throw new Error("Invalid");
    //if (!ctx.currentUser) throw new Error("Only for logged in users");

    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    // transaction!
    //at first, remove connected contacts
    const deleteContacts = ctx.prisma.contact.deleteMany({
      where: {
        partyRelationshipId: id,
        appUserGroupId: ctx.currentUser.currentAppUserGroupId,
      },
    });

    const deletePartyRelationship = ctx.prisma.partyRelationship.delete({
      where: {
        id: id,
      },
    });

    const response = await ctx.prisma.$transaction([
      deleteContacts,
      deletePartyRelationship,
    ]);
    console.log(response); //debug
    return {
      status: "SUCCESS",
    };
  }

  @Authorized()
  @Query((returns) => [Person], { nullable: true })
  async personsByAppUserGroup(
    @Arg("data") data: PartyByAppUserGroupInput,
    @Ctx() ctx: Context
  ) {
    let statusCondition = data.statusId
      ? Prisma.sql`AND "Party"."statusId" = ${data.statusId}`
      : Prisma.empty;

    return ctx.prisma.$queryRaw<Person[]>(Prisma.sql`
      SELECT "Person".* 
      FROM "Party"
      INNER JOIN "Person" ON "Party"."id" = "Person"."partyId"
      WHERE "Party"."appUserGroupId" = ${data.appUserGroupId}
      AND "Party"."statusId" != 4
      ${statusCondition}
    `);
  }

  @Authorized()
  @Query((returns) => [Organization], { nullable: true })
  async organizationsByAppUserGroup(
    @Arg("data") data: PartyByAppUserGroupInput,
    @Ctx() ctx: Context
  ) {
    //ensure user is authorized
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.id, ctx.appRoles)
    )
      throw new Error("Not authorized");

    return ctx.prisma.appUserGroup
      .findUnique({
        where: {
          id: data.appUserGroupId,
        },
      })
      .parties({
        where: {
          typeId: data.partyTypeId,
          statusId: data.statusId && data.statusId,
        },
        include: {
          organization: true,
        },
      })
      .then((res) => {
        return res.map((item) => {
          return item.organization;
        });
      });
  }

  @Authorized()
  @Query((returns) => ExtendedPerson, { nullable: true })
  async personById(
    @Arg("data") data: PartyByAppUserGroupInput,
    @Ctx() ctx: Context
  ) {
    //let partyTypeName = data.partyTypeId === 1 ? `"Person"` : `"Organization"`

    const queryResultArray = await ctx.prisma.$queryRaw<
      [ExtendedPerson]
    >(Prisma.sql`
      SELECT "Person".*, "Party"."statusId"
      FROM "Party"
      INNER JOIN "Person" ON "Party"."id" = "Person"."partyId"
      WHERE "Party"."appUserGroupId" = ${data.appUserGroupId}
      AND "Party"."id" = ${data.id}
    `);

    if (!queryResultArray.length) return null;
    return queryResultArray[0];
  }

  @Authorized()
  @Query((returns) => ExtendedOrganization, { nullable: true })
  async organizationById(
    @Arg("data") data: PartyByAppUserGroupInput,
    @Ctx() ctx: Context
  ) {
    //let partyTypeName = data.partyTypeId === 1 ? `"Person"` : `"Organization"`

    const queryResultArray = await ctx.prisma.$queryRaw<
      [ExtendedOrganization]
    >(Prisma.sql`
      SELECT "Organization".*, "Party"."statusId"
      FROM "Party"
      INNER JOIN "Organization" ON "Party"."id" = "Organization"."partyId"
      WHERE "Party"."appUserGroupId" = ${data.appUserGroupId}
      AND "Party"."id" = ${data.id}
    `);

    if (!queryResultArray.length) return null;

    return queryResultArray[0];
  }

  @Authorized()
  @Query((returns) => [PartyWithName])
  async partiesByName(
    @Arg("data") data: PartyByNameInput,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    if (!data.searchedName.length) return [];

    const searchText = `%${data.searchedName}%`;

    const queryResultArray = await ctx.prisma.$queryRaw<
      [PartyWithName]
    >(Prisma.sql`
      SELECT "Organization"."partyId" as "id", "Organization"."name"
      FROM "Organization"
      INNER JOIN "Party" ON "Party"."id" = "Organization"."partyId"
      WHERE "Party"."appUserGroupId" = ${data.appUserGroupId} 
      AND LOWER("Organization"."name") LIKE ${searchText}
        UNION ALL
      SELECT "Person"."partyId" as "id", CONCAT ("Person"."surname", ' ', "Person"."name") as "name"
      FROM "Person"
      INNER JOIN "Party" ON "Party"."id" = "Person"."partyId"
      WHERE "Party"."appUserGroupId" = ${data.appUserGroupId} 
      AND (LOWER("Person"."name") LIKE ${searchText}
        OR LOWER("Person"."surname") LIKE ${searchText}
      )
    `);

    return queryResultArray;
  }

  @Authorized()
  @Query((returns) => [ExtendedPartyRelationship])
  async partyRelationships(
    @Arg("partyId", (type) => Int) partyId: number,
    @Arg("appUserGroupId", (type) => Int) appUserGroupId: number,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    // const unsortedList = await ctx.prisma.partyRelationship.findMany({
    //   where: {
    //     OR: [
    //       {firstPartyId: partyId},
    //       {secondPartyId: partyId}
    //     ]

    //   }
    // });

    const personToPerson = await ctx.prisma.$queryRaw<
      [ExtendedPartyRelationship]
    >(Prisma.sql`
        SELECT 
          "PartyRelationship"."id", 
          "PartyRelationship"."firstPartyId", 
          "PartyRelationship"."secondPartyId", 
          "PartyRelationship"."typeId", 
          "FirstPartyPerson"."name" AS "firstPartyName",
          "secondPartyPerson"."name" AS "secondPartyName"
        FROM "PartyRelationship"
        INNER JOIN (SELECT "Person"."partyId", CONCAT ("Person"."surname", ' ', "Person"."name") as "name"
                    FROM "Person") AS "FirstPartyPerson" ON "FirstPartyPerson"."partyId" = "PartyRelationship"."firstPartyId"
        INNER JOIN (SELECT "Person"."partyId", CONCAT ("Person"."surname", ' ', "Person"."name") as "name"
                    FROM "Person") AS "SecondPartyPerson" ON "SecondPartyPerson"."partyId" = "PartyRelationship"."secondPartyId"
        WHERE "firstPartyTypeId" = 1
        AND "secondPartyTypeId" = 1
        AND ("PartyRelationship"."firstPartyId" = ${partyId}
          OR "PartyRelationship"."secondPartyId" = ${partyId}
        )`
      );

      // for this kind of relationship, organization has always higher priority, therefore its always 'firstParty'
      const personToOrganization = await ctx.prisma.$queryRaw<
      [ExtendedPartyRelationship]
    >(Prisma.sql`
        SELECT 
          "PartyRelationship"."id", 
          "PartyRelationship"."firstPartyId", 
          "PartyRelationship"."secondPartyId", 
          "PartyRelationship"."typeId", 
          "FirstPartyOrganization"."name" AS "firstPartyName",
          "SecondPartyPerson"."name" AS "secondPartyName"
        FROM "PartyRelationship"
        INNER JOIN (SELECT "Organization"."partyId", "Organization"."name"
                    FROM "Organization") AS "FirstPartyOrganization" ON "FirstPartyOrganization"."partyId" = "PartyRelationship"."firstPartyId"
        INNER JOIN (SELECT "Person"."partyId", CONCAT ("Person"."surname", ' ', "Person"."name") as "name"
                    FROM "Person") AS "SecondPartyPerson" ON "SecondPartyPerson"."partyId" = "PartyRelationship"."secondPartyId"
        WHERE "firstPartyTypeId" = 2
        AND "secondPartyTypeId" = 1
        AND ("PartyRelationship"."firstPartyId" = ${partyId}
          OR "PartyRelationship"."secondPartyId" = ${partyId}
        )`
      );

      const organizationToOrganization = await ctx.prisma.$queryRaw<
      [ExtendedPartyRelationship]
    >(Prisma.sql`
        SELECT 
          "PartyRelationship"."id", 
          "PartyRelationship"."firstPartyId", 
          "PartyRelationship"."secondPartyId", 
          "PartyRelationship"."typeId", 
          "FirstPartyOrganization"."name" AS "firstPartyName",
          "SecondPartyOrganization"."name" AS "secondPartyName"
        FROM "PartyRelationship"
        INNER JOIN (SELECT "Organization"."partyId", "Organization"."name"
                    FROM "Organization") AS "FirstPartyOrganization" ON "FirstPartyOrganization"."partyId" = "PartyRelationship"."firstPartyId"
        INNER JOIN (SELECT "Organization"."partyId", "Organization"."name"
                    FROM "Organization") AS "SecondPartyOrganization" ON "SecondPartyOrganization"."partyId" = "PartyRelationship"."secondPartyId"
        WHERE "firstPartyTypeId" = 2
        AND "secondPartyTypeId" = 2
        AND ("PartyRelationship"."firstPartyId" = ${partyId}
          OR "PartyRelationship"."secondPartyId" = ${partyId}
        )`
      );

      return {
        "personToPerson": personToPerson,
        "personToOrganization": personToOrganization,
        "organizationToOrganization": organizationToOrganization,
      }


    //   SELECT 
    //     "PartyRelationship"."id", 
    //     "PartyRelationship"."firstPartyId", 
    //     "PartyRelationship"."secondPartyId", 
    //     "FirstPartyPerson"."name" AS "firstPartyPersonName", 
    //     "SecondPartyPerson"."name" AS "secondPartyPersonName", 
    //     "FirstPartyOrganization"."name" AS "firstPartyOrganizationName", 
    //     "SecondPartyOrganization"."name" AS "secondPartyOrganizationName" 
    //   FROM "PartyRelationship"
    //   LEFT JOIN 
    //     (SELECT "Person"."partyId", CONCAT ("Person"."surname", ' ', "Person"."name") as "name"
    //     FROM "Person")
    //   AS "FirstPartyPerson" ON "FirstPartyPerson"."partyId" = "PartyRelationship"."firstPartyId"
    //   LEFT JOIN 
    //     (SELECT "Person"."partyId", CONCAT ("Person"."surname", ' ', "Person"."name") as "name"
    //     FROM "Person")
    //   AS "SecondPartyPerson" ON "SecondPartyPerson"."partyId" = "PartyRelationship"."secondPartyId"
    //   LEFT JOIN 
    //     (SELECT "Organization"."partyId", "Organization"."name"
    //     FROM "Organization")
    //   AS "FirstPartyOrganization" ON "FirstPartyOrganization"."partyId" = "PartyRelationship"."firstPartyId"
    //   LEFT JOIN 
    //   (SELECT "Organization"."partyId", "Organization"."name"
    //   FROM "Organization")
    //   AS "SecondPartyOrganization" ON "SecondPartyOrganization"."partyId" = "PartyRelationship"."secondPartyId"
    //   WHERE "PartyRelationship"."firstPartyId" = ${partyId}
    //   OR "PartyRelationship"."secondPartyId" = ${partyId}
    // `);

    //return queryResultArray;
  }

  @Authorized()
  @Query((returns) => [PartyRelationshipType])
  async partyRelationshipTypeList(
    @Ctx() ctx: Context
  ): Promise<PartyRelationshipType[]> {
    if (!ctx.currentUser) throw new Error("Only for logged in users");

    return await ctx.prisma.partyRelationshipType.findMany();
  }
}
