import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'
import { Status } from './Status'

@ObjectType()
export class Contact {
  @Field((type) => ID)
  id: number

  @Field((type) => ID, { nullable: true })
  typeId: number | null
  
  @Field((type) => ID, { nullable: true })
  statusId: number | null

  @Field((type) => String)
  value: string

  @Field((type) => Date)
  createdAt: Date

  @Field((type) => Date, {nullable:true})
  updatedAt: Date | null

  @Field((type) => ID)
  mainPartyId: number

  @Field((type) => Number, {nullable: true})
  partyRelationshipId: number | null

  @Field((type) => ID)
  appUserGroupId: number
}

@ObjectType()
class ContactType {
  @Field((type) => ID)
  id: number

  @Field((type) => String)
  name: string
}

@ObjectType()
export class ExtendedContact extends Contact {

  @Field((type) => ContactType, { nullable: true })
  contactType: ContactType | null

  @Field((type) => Status, { nullable: true })
  status: Status | null
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