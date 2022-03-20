import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'
//import { IsEmail } from 'class-validator'
//import {IsEmailAlreadyExist} from './decorators/isEmailAlreadyExist'
//import { Post } from './Post'

@ObjectType()
export class AppUser {
  @Field((type) => ID)
  id: number

  @Field((type) => String)
  //@IsEmail()
  //@IsEmailAlreadyExist({message: "email already used"})
  email: string
  
  @Field((type) => String)
  password: string

  @Field((type) => String, { nullable: true })
  nickname: string | null

  @Field((type) => Number, {nullable: true})
  appUserGroupId: number |null

  @Field((type) => Number)
  count: number
  // @Field((type) => [Post], { nullable: true })
  // posts?: [Post] | null
}