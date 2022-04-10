import 'reflect-metadata'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
class AppUserGroupRelationship {
  @Field(type => Number)
  appUserGroupId: number;
  @Field(type => Number)
  appUserRoleId: number;
}

@ObjectType()
export class AppUser {
  @Field((type) => ID)
  id: number

  @Field((type) => String)
  email: string
  
  @Field((type) => String)
  password: string

  @Field((type) => String, { nullable: true })
  nickname: string | null

  //@Field()
  appUserGroupRelationships: AppUserGroupRelationship[] 

  @Field((type) => Number)
  count: number
  // @Field((type) => [Post], { nullable: true })
  // posts?: [Post] | null
}