import 'reflect-metadata'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  // FieldResolver,
  // Root,
  // Int,
  InputType,
  Field,
  Authorized
} from 'type-graphql'
//import { Post } from './Post'
import { APIResponse } from './GlobalObjects'
import { AppUser, AppUserLoginResponse } from './AppUser'
import { Context } from './context'
import { Prisma } from '@prisma/client'
import { IsEmail } from 'class-validator'
import { IsEmailAlreadyExist } from './decorators/isEmailAlreadyExist'
import bcrypt from "bcryptjs";
import { createTokens } from './auth';

@InputType()
class AppUserGroupUniqueInput {
  @Field()
  id: number
}

@InputType()
class AppUserLogin {
  @Field()
  email: string
  @Field()
  password: string
}

@InputType()
class AppUserInput {

  @Field({ nullable: true })
  id: number

  @Field({ nullable: true })
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already used" })
  email: string

  @Field({ nullable: true })
  password: string

  @Field({ nullable: true })
  nickname: string

  @Field({ nullable: true })
  appUserGroupId: number

  @Field({ nullable: true })
  appUserRoleId: number

  // @Field((type) => [PostCreateInput], { nullable: true })
  // posts: [PostCreateInput]
}

@Resolver(AppUser)
export class AppUserResolver {


  @Mutation(() => APIResponse)
  async createUpdateAppUser(
    @Arg('data') data: AppUserInput,
    @Ctx() ctx: Context,
  ): Promise<APIResponse> {

    if (ctx.currentUser && ctx.currentUser.id === data.id && data.password.length) {
      const hashedPassword = await bcrypt.hash(data.password, 10)
      // user updates his profile

      await ctx.prisma.appUser.update({
        where: {
          id: data.id,
        },
        data: {
          email: data?.email,
          nickname: data?.nickname,
          password: hashedPassword
        }
      })

      return { result: 'success', message: 'account details updated' }

    } else if (ctx.currentUser) {
      // admin is setting a membership & role to regular user

      const appUserGroups = ctx.currentUser.appUserGroupRelationships
      let userIsAdminInTargetGroup = false

      for (let i = 0; i < appUserGroups.length; i++) {
        if (appUserGroups[i].appUserGroupId === data.appUserGroupId && ctx.appRoles[appUserGroups[i].appUserRoleId] === "ADMIN") {
          // user has admin role in the target group
          userIsAdminInTargetGroup = true
          break;
        }
      }

      if (!userIsAdminInTargetGroup) throw new Error('Not permitted for this action')

      // remove existing roles in target group
      await ctx.prisma.appUserGroupRelationship.deleteMany({
        where: {
          appUserGroupId: data.appUserGroupId
        }
      })

      // set new role 

      if (data.appUserRoleId !== 0) await ctx.prisma.appUserGroupRelationship.create({
        data: {
          appUserId: data.id,
          appUserGroupId: data.appUserGroupId,
          appUserRoleId: data.appUserRoleId
        }
      })

      return { result: 'success', message: 'membership and role were set' }
    }

    else {
      const hashedPassword = await bcrypt.hash(data.password, 10)

      const appUser = await ctx.prisma.appUser.create({
        data: {
          email: data.email.toLocaleLowerCase(),
          nickname: data?.nickname,
          password: hashedPassword
        },
      })

      //option to create new appUserGroup with just single user in it
      //or to create a request to include in existing user group

      // await ctx.prisma.appUserGroupRelationship.create({
      //   data: {
      //     appUserId: appUser.id,
      //     appUserGroupId: data.appUserGroupId,
      //     appUserRoleId: data.appUserRoleId
      //   }
      // })

      return { result: 'success', message: 'account created' }
    }

  }
  @Query(() => AppUserLoginResponse)
  async login(
    @Arg("data") data: AppUserLogin,
    @Ctx() ctx: Context
  ): Promise<AppUserLoginResponse> {
    const user = await ctx.prisma.appUser.findFirst({ where: { email: data.email } });

    if (!user) {
      throw new Error('invalid credentials')
    }

    const valid = await bcrypt.compare(data.password, user.password)

    if (!valid) {
      throw new Error('invalid credentials')
    }

    const { accessToken } = createTokens(user) //refreshToken TBI

    //ctx.res.cookie("refresh-token", refreshToken); // set cookies
    //ctx.res.cookie("access-token", accessToken);

    const appUserGroupRelationships = await ctx.prisma.appUserGroupRelationship.findMany({ where: { appUserId: user.id } })

    return {
      appUser: { 
        ...user,
        appUserGroupRelationships: appUserGroupRelationships
      },
      accessToken
      //refreshToken
    }
  }

  @Authorized(["MOD"])
  @Query(() => [AppUser])
  async allAppUsers(
    @Arg("data") data: AppUserGroupUniqueInput,
    @Ctx() ctx: Context) {
    return ctx.prisma.appUserGroupRelationship.findMany({ where: { appUserGroupId: data.id } })
  }

}