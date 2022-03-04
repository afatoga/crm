import 'reflect-metadata'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
} from 'type-graphql'
import { Party, Person, PartyRelationship } from './Party'
import { Context } from './context'


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
class PartyRelationshipInput {
  @Field()
  firstPartyId: number

  @Field()
  secondPartyId: number

  @Field({nullable: true})
  typeId: number
}



@Resolver(Party)
export class PartyResolver {

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

    if (isRelationshipExist) throw new Error('This relationship exists')

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


  // @Query((returns) => [Post], { nullable: true })
  // async draftsByAppUser(
  //   @Arg('appUserUniqueInput') appUserUniqueInput: AppUserUniqueInput,
  //   @Ctx() ctx: Context,
  // ) {
  //   return ctx.prisma.appUser
  //     .findUnique({
  //       where: {
  //         id: appUserUniqueInput.id || undefined,
  //         email: appUserUniqueInput.email || undefined,
  //       },
  //     })
  //     .posts({
  //       where: {
  //         published: false,
  //       },
  //     })
  // }

}