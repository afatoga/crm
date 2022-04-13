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
} from "type-graphql";
import { Contact } from "./Contact";
import { APIResponse } from "./GlobalObjects";
import { Context } from "./context";

@InputType()
class ContactInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  typeId: number;

  @Field({ nullable: true })
  statusId: number;

  @Field({ nullable: true })
  value: string;

  @Field({ nullable: true })
  mainPartyId: number; //target

  @Field({ nullable: true })
  partyRelationshipId: number; //target

  @Field({nullable: true})
  operation: 'CREATE' | 'UPDATE' | 'DELETE'

}

@InputType()
class PartyContactsInput {
  @Field()
  partyId: number;

  @Field({ nullable: true})
  partyRelationshipId: number;
}



//@Service()
@Resolver(Contact)
export class ContactResolver {
  
  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => Contact)
  async createUpdateContact(
    @Arg("data") data: ContactInput,
    @Ctx() ctx: Context
  ): Promise<Contact> {
    if (!ctx.currentUser) throw new Error("Only for logged in users");

    if (data.operation === "CREATE") {

      if (!data.value || !data.mainPartyId) throw new Error('provide contact value')

      return await ctx.prisma.contact.create({data: {
        typeId: data.typeId && data.typeId,
        value: data.value,
        mainPartyId: data.mainPartyId,
        partyRelationshipId: data.partyRelationshipId && data.partyRelationshipId,
        appUserGroupId: ctx.currentUser.currentAppUserGroupId
      }})

    }

    else if (data.operation === "UPDATE") {
      if (!data.id) throw new Error('provide contact id')

      const currentContact = await ctx.prisma.contact.findUnique({where: {id : data.id}})
      if (!currentContact) throw new Error('contact does not exist')

      if (data.partyRelationshipId) {
        const partyRelationship = await ctx.prisma.partyRelationship.findUnique({where: {id : data.partyRelationshipId}})
        if (!partyRelationship) throw new Error('partyRelationship does not exist')
      }

      return await ctx.prisma.contact.update({
        where: {
          id: data.id
        },
        data: {
          typeId: data.typeId && data.typeId,
          value: data.value,
          mainPartyId: data.mainPartyId,
          partyRelationshipId: data.partyRelationshipId && data.partyRelationshipId
        }
      })

    }

    else if (data.operation === "DELETE") {
      //if (!data.id) throw new Error('provide contact id')

      return await ctx.prisma.contact.delete({
        where: {
          id: data.id
        }
      })
    }

    throw new Error('invalid request')

  }

  @Authorized()
  @Query((returns) => [Contact], { nullable: true })
  async partyContacts(
    @Arg("data") data: PartyContactsInput,
    @Ctx() ctx: Context
  ) {
    if (!ctx.currentUser) throw new Error("please log in");

    return ctx.prisma.contact
      .findMany({
        where: {
          mainPartyId: data.partyId,
          partyRelationshipId: (data.partyRelationshipId) ? data.partyRelationshipId : null
        }
      })
  }

  @Authorized()
  @Query((returns) => [Contact], { nullable: true })
  async contactsByProps(
    @Arg("data") data: ContactInput,
    @Ctx() ctx: Context
  ) {
    if (!ctx.currentUser) throw new Error("please log in");

    return ctx.prisma.contact
      .findMany({
        where: {
          typeId: data.typeId && data.typeId,
          value: data.value && {contains: data.value},
          mainPartyId: data.mainPartyId,
          partyRelationshipId: data.partyRelationshipId && data.partyRelationshipId,
          appUserGroupId: ctx.currentUser.currentAppUserGroupId
        }
      })
  }

  // appUserGroupId:
  //    data.appUserGroupId &&
  //    isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
  //    ? data.appUserGroupId
  //    : undefined,

}
