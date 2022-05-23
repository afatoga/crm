import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Status {
  @Field((type) => ID)
  id: number

  @Field((type) => String)
  name: string
}