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