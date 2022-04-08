import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'


@ObjectType()
export class APIResponse {

  @Field((type) => String)
  result: string

  @Field((type) => String)
  message?: string
}