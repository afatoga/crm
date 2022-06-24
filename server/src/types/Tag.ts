import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Tag {
  @Field((type) => ID)
  id: number

  @Field((type) => Number, {nullable:true})
  statusId: number | null

  @Field((type) => String)
  name: string

  @Field((type) => Date)
  createdAt: Date | null

  @Field((type) => Date, {nullable:true})
  updatedAt: Date | null

  @Field((type) => Number, {nullable:true})
  appUserGroupId: number | null
}

@ObjectType()
export class ExtendedTag extends Tag {
  @Field((type) => String, { nullable: true })
  statusName: string | null
}

@ObjectType()
class TagParty {
  @Field((type) => ID)
  tagId: number

  @Field((type) => ID)
  partyId: number
}

@ObjectType()
export class ExtendedTagParty extends TagParty {
  // @Field((type) => ID) 
  // partyTypeId: number

  @Field((type) => String, { nullable: true }) 
  tagName: string | null

  @Field((type) => String, { nullable: true }) 
  personFullName: string | null

  @Field((type) => String, { nullable: true }) 
  organizationName: string | null

  @Field((type) => ID)  //partyTypeId
  typeId: number

  @Field((type) => ID)
  partyId: number
}