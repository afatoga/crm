import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Contact {
  @Field((type) => ID)
  id: number

  @Field((type) => Number, { nullable: true })
  typeId: number | null

  @Field((type) => Number, { nullable: true })
  statusId: number | null

  @Field((type) => String)
  value: string

  @Field((type) => Date)
  createdAt: Date

  @Field((type) => Date, {nullable:true})
  updatedAt: Date | null

  @Field((type) => Number)
  mainPartyId: number

  @Field((type) => Number, {nullable: true})
  partyRelationshipId: number | null

  @Field((type) => Number)
  appUserGroupId: number
}


// @ObjectType()
// export class PartyRelationship {
//   @Field((type) => ID)
//   id: number

//   @Field((type) => Number,  { nullable: true })
//   typeId: number | null

//   @Field((type) => Number)
//   firstPartyId: number

//   @Field((type) => Number)
//   secondPartyId: number
// }