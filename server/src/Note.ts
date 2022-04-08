import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Note {
  @Field((type) => ID)
  id: number

  @Field((type) => String)
  content: string

  // @Field((type) => Date, {nullable:true})
  // createdAt: string | null

  // @Field((type) => Date, {nullable:true})
  // updatedAt: string | null

  @Field((type) => Number)
  appUserId: number

  @Field((type) => Number, {nullable:true})
  appUserGroupId: number | null

  // @Field((type) => [Post], { nullable: true })
  // posts?: [Post] | null
}