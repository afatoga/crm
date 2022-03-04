import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'


@ObjectType()
export class AppUserGroup {
  @Field((type) => ID)
  id: number

  @Field((type) => String)
  name: string

  @Field((type) => String)
  note: string
}