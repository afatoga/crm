import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Party {
  @Field((type) => ID)
  id: number

  @Field((type) => Number, { nullable: true })
  typeId: number | null

  @Field((type) => Number, { nullable: true })
  statusId: number | null

  // @Field((type) => Date, {nullable:true})
  // createdAt: string | null

  // @Field((type) => Date, {nullable:true})
  // updatedAt: string | null

  @Field((type) => Number)
  appUserGroupId: number

  // @Field((type) => [Post], { nullable: true })
  // posts?: [Post] | null
}

@ObjectType()
export class Person {
  @Field((type) => ID)
  partyId: number

  @Field((type) => String, { nullable: true })
  preDegree: string | null

  @Field((type) => String)
  name: string

  @Field((type) => String)
  surname: string

  @Field((type) => String, { nullable: true })
  postDegree: string | null

  @Field((type) => Date, { nullable: true })
  birthday: Date | null
}

@ObjectType()
export class Organization {
  @Field((type) => ID)
  partyId: number

  @Field((type) => String)
  name: string

  @Field((type) => Number,  { nullable: true })
  typeId: number | null
}

@ObjectType()
export class PartyRelationship {
  @Field((type) => ID)
  id: number

  @Field((type) => Number,  { nullable: true })
  typeId: number | null

  @Field((type) => Number)
  firstPartyId: number

  @Field((type) => Number)
  secondPartyId: number
}