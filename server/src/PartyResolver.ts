import "reflect-metadata";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  Authorized,
  Int,
} from "type-graphql";
import { Party, Person, ExtendedPerson, ExtendedOrganization, PartyRelationship, Organization } from "./Party";
import { Context } from "./context";
import { Prisma } from "@prisma/client";
import { isUserAuthorized } from "./authChecker";
//import { Service } from 'typedi'

@InputType()
class PersonInput {
  @Field(type => Int, { nullable: true })
  partyId: number;

  // @Field({ nullable: true })
  // typeId: number;

  @Field(type => Int, { nullable: true })
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

  @Field(type => Int,{ nullable: true })
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
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  firstPartyId: number;

  @Field({ nullable: true })
  secondPartyId: number;

  @Field({ nullable: true })
  typeId: number;

  @Field({ nullable: true })
  operation: "CREATE" | "UPDATE" | "DELETE";
}
@InputType()
class PartyByAppUserGroupInput {
  @Field(type => Int)
  appUserGroupId: number;

  @Field({nullable: true})
  partyTypeId: number;

  @Field(type => Int, { nullable: true })
  id: number;

  @Field(type => Int, { nullable: true })
  statusId: number;
}

//@Service()
@Resolver(Party)
export class PartyResolver {
  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => Person)
  async createUpdatePerson(
    @Arg("data") data: PersonInput,
    @Ctx() ctx: Context
  ): Promise<Person> {
  
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    if (data.partyId) {

      if (data.statusId) await ctx.prisma.party.update({
        where: {
          id: data.partyId
        },
        data: {
          statusId: data.statusId
        }
      })

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

    // const person = await ctx.prisma.person.findFirst({
    //   where: {
    //     name: data.name,
    //     surname: data.surname,
    //   }
    // })

    //if (!person) {
    //create
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

    //return person; //or return error that user exists
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
  async createUpdatePartyRelationship(
    @Arg("data") data: PartyRelationshipInput,
    @Ctx() ctx: Context
  ): Promise<PartyRelationship> {
    if (!data.operation) throw new Error("Invalid");
    if (!ctx.currentUser) throw new Error("Only for logged in users");
    if (data.firstPartyId === data.secondPartyId)
      throw new Error("use two different parties");

    if (data.operation === "CREATE") {
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
    } else if (data.operation === "UPDATE") {
      if (!data.id) throw new Error("provide id to update");
      const existingRelationship = await ctx.prisma.partyRelationship.findFirst(
        {
          where: {
            firstPartyId: data.firstPartyId,
            secondPartyId: data.secondPartyId,
            typeId: data.typeId
          },
        }
      );

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
    } else if (data.operation === "DELETE") {
      if (!data.id) throw new Error("provide id for removal");

      //remove all contacts
      await ctx.prisma.contact.deleteMany({
        where: {
          partyRelationshipId: data.id,
          appUserGroupId: ctx.currentUser.currentAppUserGroupId,
        },
      });

      return await ctx.prisma.partyRelationship.delete({
        where: {
          id: data.id,
        },
      });
    }

    throw new Error("invalid request");
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

    const queryResultArray = await ctx.prisma.$queryRaw<[ExtendedPerson]>(Prisma.sql`
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

    const queryResultArray = await ctx.prisma.$queryRaw<[ExtendedOrganization]>(Prisma.sql`
      SELECT "Organization".*, "Party"."statusId"
      FROM "Party"
      INNER JOIN "Organization" ON "Party"."id" = "Organization"."partyId"
      WHERE "Party"."appUserGroupId" = ${data.appUserGroupId}
      AND "Party"."id" = ${data.id}
    `);

    if (!queryResultArray.length) return null;

    return queryResultArray[0];

  }
}
