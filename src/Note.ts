import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Note {
  @Field((type) => ID)
  id: number

  @Field((type) => String)
  content: string

  @Field((type) => Number)
  appUserId: number

  @Field((type) => Number, {nullable:true})
  appUserGroupId: number// | null
}