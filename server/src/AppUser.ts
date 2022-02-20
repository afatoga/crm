import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'
import { IsEmail } from 'class-validator'
//import { Post } from './Post'

@ObjectType()
export class AppUser {
  @Field((type) => ID)
  id: number

  @Field()
  @IsEmail()
  email: string

  @Field((type) => String, { nullable: true })
  nickname?: string | null

  // @Field((type) => [Post], { nullable: true })
  // posts?: [Post] | null
}