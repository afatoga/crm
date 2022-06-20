import "reflect-metadata";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Int,
  Field,
  Authorized,
} from "type-graphql";
import { Contact, ContactType, ExtendedContact } from "./Contact";
import { APIResponse } from "./GlobalObjects";
import { isUserAuthorized } from "./authChecker";
import { Context } from "./context";

@InputType()
class ContactInput {
  @Field((type) => Int, { nullable: true })
  id: number;

  @Field((type) => Int, { nullable: true })
  typeId: number;

  @Field((type) => Int, { nullable: true })
  statusId: number;

  @Field({ nullable: true })
  value: string;

  @Field((type) => Int, { nullable: true })
  mainPartyId: number; //target

  @Field((type) => Int, { nullable: true })
  partyRelationshipId: number; //target

  @Field((type) => Int)
  appUserGroupId: number;
}

@InputType()
class DeleteContactInput {
  @Field((type) => Int)
  id: number;

  @Field((type) => Int)
  appUserGroupId: number;
}

@InputType()
class PartyContactsInput {
  @Field((type) => Int!)
  partyId: number;

  // @Field((type) => Int, { nullable: true })
  // partyRelationshipId: number;

  @Field((type) => Int, { nullable: true })
  statusId: number;

  @Field((type) => Int)
  appUserGroupId: number;
}

@InputType()
class PartyRelationshipContactsInput {
  @Field((type) => Int!)
  partyId: number;

  @Field((type) => [Int!])
  partyRelationshipIdList: [number];

  @Field((type) => Int, { nullable: true })
  statusId: number;

  @Field((type) => Int)
  appUserGroupId: number;
}

//@Service()
@Resolver(Contact)
export class ContactResolver {
  @Authorized()
  @Query((returns) => [ContactType])
  async contactTypeList(@Ctx() ctx: Context): Promise<ContactType[]> {
    if (!ctx.currentUser) throw new Error("Not authorized");

    return await ctx.prisma.contactType.findMany();
  }

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => APIResponse)
  async deleteContact(
    @Arg("data") data: DeleteContactInput,
    @Ctx() ctx: Context
  ): Promise<APIResponse> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    if (!data.id) throw new Error("provide contact id");

    await ctx.prisma.contact.delete({
      where: {
        id: data.id,
      },
    });

    return {
      status: "SUCCESS",
      message: "contact was deleted",
    };
  }
  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => Contact)
  async createContact(
    @Arg("data") data: ContactInput,
    @Ctx() ctx: Context
  ): Promise<Contact> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    if (!data.value || !data.mainPartyId)
      throw new Error("provide contact value");

    const mainParty = await ctx.prisma.party.findFirst({
      where: {
        id: data.mainPartyId,
        appUserGroupId: data.appUserGroupId,
      },
    });

    if (!mainParty) throw new Error("Not authorized");

    return await ctx.prisma.contact.create({
      data: {
        typeId: data.typeId && data.typeId,
        value: data.value,
        mainPartyId: mainParty.id,
        partyRelationshipId:
          data.partyRelationshipId && data.partyRelationshipId,
        statusId: data?.statusId,
        appUserGroupId: data.appUserGroupId, //ctx.currentUser.currentAppUserGroupId
      },
    });
  }

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => Contact)
  async updateContact(
    @Arg("data") data: ContactInput,
    @Ctx() ctx: Context
  ): Promise<Contact> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    if (!data.id || data.mainPartyId) throw new Error("contact not found");

    const currentContact = await ctx.prisma.contact.findUnique({
      where: { id: data.id },
    });
    if (!currentContact) throw new Error("contact not found");

    // zamceni zaznamu for update
    // druhy uzivatel ceka, nedostane nactana data

    if (data.partyRelationshipId) {
      const partyRelationship = await ctx.prisma.partyRelationship.findUnique({
        where: { id: data.partyRelationshipId },
      });
      if (!partyRelationship)
        throw new Error("partyRelationship does not exist");
    }

    return await ctx.prisma.contact.update({
      where: {
        id: data.id,
      },
      data: {
        typeId: data.typeId && data.typeId,
        value: data.value,
        //mainPartyId: data.mainPartyId,
        partyRelationshipId:
          data.partyRelationshipId && data.partyRelationshipId,
        statusId: data?.statusId
      },
    });
  }

  @Authorized()
  @Query((returns) => [ExtendedContact])
  async partyPrivateContacts(
    @Arg("data") data: PartyContactsInput,
    @Ctx() ctx: Context
  ) {

    let whereConditions: any = {
      mainPartyId: data.partyId,
      partyRelationshipId: null, //has to be null
    };

    if (data.statusId) {
      whereConditions = { ...whereConditions, statusId: data.statusId };
    } else if (!data.statusId) {
      whereConditions = {
        ...whereConditions,
        OR: [{ statusId: { not: 4 } }, { statusId: null }],
      };
    }

    return await ctx.prisma.contact.findMany({
      where: whereConditions,
      include: {
        contactType: true,
        // {
        //   select: 
        //   {  name: true,},
        // },
        status: true
        // {
        //   select: {
        //     name: true,
        //   },
        // },
      },
    });
  }

  @Authorized()
  @Query((returns) => [ExtendedContact])
  async partyRelationshipContacts(
    @Arg("data") data: PartyRelationshipContactsInput,
    @Ctx() ctx: Context
  ) {
    //if (!data.partyRelationshipId)  throw new Error("Party relationship invalid");

    let whereConditions: any = {
      mainPartyId: data.partyId,
      partyRelationshipId: { in: data.partyRelationshipIdList },
    };

    if (data.statusId) {
      whereConditions = { ...whereConditions, statusId: data.statusId };
    } else if (!data.statusId) {
      whereConditions = {
        ...whereConditions,
        OR: [{ statusId: { not: 4 } }, { statusId: null }],
      };
    }

    return ctx.prisma.contact.findMany({
      where: whereConditions,
      include: {
        contactType: true,
        status: true,
      },
    });
  }

  // @Authorized()
  // @Query((returns) => [Contact], { nullable: true })
  // async contactsByProps(@Arg("data") data: ContactInput, @Ctx() ctx: Context) {
  //   if (!ctx.currentUser) throw new Error("please log in");

  //   return ctx.prisma.contact.findMany({
  //     where: {
  //       typeId: data.typeId && data.typeId,
  //       value: data.value && { contains: data.value },
  //       mainPartyId: data.mainPartyId,
  //       partyRelationshipId:
  //         data.partyRelationshipId && data.partyRelationshipId,
  //       appUserGroupId: ctx.currentUser.currentAppUserGroupId,
  //     },
  //   });
  // }

  // appUserGroupId:
  //    data.appUserGroupId &&
  //    isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
  //    ? data.appUserGroupId
  //    : undefined,
}
