import 'reflect-metadata'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  Authorized,
} from 'type-graphql'
import { Party, Person, PartyRelationship, Organization } from './Party'
import { Context } from './context'
import { Prisma } from '@prisma/client'
//import { Service } from 'typedi'


@InputType()
class PersonInput {
  @Field({ nullable: true })
  partyId: number

  @Field({ nullable: true })
  typeId: number

  @Field({ nullable: true })
  statusId: number

  @Field({ nullable: true })
  preDegree: string

  @Field()
  name: string

  @Field()
  surname: string

  @Field({ nullable: true })
  postDegree: string

  @Field({ nullable: true })
  birthday: Date

  @Field()
  appUserGroupId: number
}

@InputType()
class OrganizationInput {
  @Field({ nullable: true })
  partyId: number

  @Field({ nullable: true })
  statusId: number

  @Field()
  name: string

  @Field({ nullable: true })
  organizationTypeId: number

  @Field()
  appUserGroupId: number
}

@InputType()
class PartyRelationshipInput {
  @Field()
  firstPartyId: number

  @Field()
  secondPartyId: number

  @Field({nullable: true})
  typeId: number
}
@InputType()
class AppUserGroupUniqueInput {
  @Field()
  id: number

  @Field({nullable: true})
  statusId: number

  @Field()
  partyTypeId: number
}


//@Service()
@Resolver(Party)
export class PartyResolver {

  @Authorized()
  @Mutation((returns) => Person)
  async createUpdatePerson(
    @Arg('data') data: PersonInput,
    @Ctx() ctx: Context,
  ): Promise<Person> {
    
    if (data.partyId) { //update
      return ctx.prisma.person.update({
        where: {
          partyId: data.partyId,
        },
        data: {
          preDegree: data?.preDegree,
          name: data.name,
          surname: data.surname,
          postDegree: data?.postDegree,
          birthday: data?.birthday
        }
      })
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
          appUserGroupId: data.appUserGroupId
        },
      })

      return ctx.prisma.person.create({
        data: {
          partyId: party.id,
          preDegree: data?.preDegree,
          name: data.name,
          surname: data.surname,
          postDegree: data?.postDegree,
          birthday: data?.birthday
        },
      })

    //return person; //or return error that user exists
  }



  @Query(() => [Person])
  async allPersons(@Ctx() ctx: Context) {
    return ctx.prisma.person.findMany()
  }

  @Mutation((returns) => Organization)
  async createUpdateOrganization(
    @Arg('data') data: OrganizationInput,
    @Ctx() ctx: Context,
  ): Promise<Organization> {
    
    if (data.partyId) { //update
      return ctx.prisma.organization.update({
        where: {
          partyId: data.partyId,
        },
        data: {
          name: data.name,
          typeId: data?.organizationTypeId,
        }
      })
    }

      //create
      const party = await ctx.prisma.party.create({
        data: {
          typeId: 2,
          appUserGroupId: data.appUserGroupId
        },
      })

      return ctx.prisma.organization.create({
        data: {
          partyId: party.id,
          name: data.name,
          typeId: data?.organizationTypeId,
        },
      })
  }

  @Query(() => [Person])
  async allOrganizations(@Ctx() ctx: Context) {
    return ctx.prisma.organization.findMany()
  }

  @Mutation((returns) => PartyRelationship)
  async createPartyRelationship(
    @Arg('data') data: PartyRelationshipInput,
    @Ctx() ctx: Context,
  ): Promise<PartyRelationship> {
    // const postData = data.posts?.map((post) => {
    //   return { title: post.title, content: post.content || undefined }
    // })

    if (data.firstPartyId === data.secondPartyId) throw new Error('Parties must be different')
  
    const isRelationshipExist = await ctx.prisma.partyRelationship.findFirst({
      where: {
        firstPartyId: data.firstPartyId,
        secondPartyId: data.secondPartyId,
        typeId: data.typeId
      },
    })

    if (isRelationshipExist) throw new Error('This relationship already exists')

    const firstParty = await ctx.prisma.party.findFirst({
      where: {
        id: data.firstPartyId
      },
    })

    const secondParty = await ctx.prisma.party.findFirst({
      where: {
        id: data.secondPartyId
      },
    })

    if (firstParty && secondParty && (firstParty.id !== secondParty.id)) { 
    
    return ctx.prisma.partyRelationship.create({
      data: {
        typeId: data.typeId,
        firstPartyId: firstParty.id,
        secondPartyId: secondParty.id
      },
    })
    }

    else throw new Error('Input parties is invalid')
  }


  @Query((returns) => [Person], { nullable: true })
  async personsByAppUserGroup(
    @Arg('data') data: AppUserGroupUniqueInput,
    @Ctx() ctx: Context,
  ) {

    let statusCondition = (data.statusId) ? Prisma.sql`AND "Party"."statusId" = ${data.statusId}` : Prisma.empty;

    return ctx.prisma.$queryRaw<Person[]>(Prisma.sql`
      SELECT "Person".* 
      FROM "Party"
      INNER JOIN "Person" ON "Party"."id" = "Person"."partyId"
      WHERE "Party"."appUserGroupId" = ${data.id}
      ${statusCondition}
    `);
    
  }

  @Query((returns) => [Organization], { nullable: true })
  async organizationsByAppUserGroup(
    @Arg('data') data: AppUserGroupUniqueInput,
    @Ctx() ctx: Context,
  ) {

    
    return ctx.prisma.appUserGroup.findUnique({
      where: {
        id: data.id
      }
    }).parties({
      where:{
        typeId: data.partyTypeId
      },
      include: {
        organizations: true
      }
    }).then((res) => 
    { 

      return res.map(item => {
        return item.organizations[0]
      })
    })

  }

}

