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
import { AppUser } from './AppUser'
import { Context } from './context'
import { Prisma } from '@prisma/client'
import { IsEmail } from 'class-validator'
import { IsEmailAlreadyExist } from './decorators/isEmailAlreadyExist'
import bcrypt from "bcryptjs";
import {createTokens} from './auth';

@InputType()
class AppUserGroupUniqueInput {
  @Field()
  id: number
}

@InputType()
class AppUserLogin {
  @Field()
  email:string
  @Field()
  password:string
}

@InputType()
class AppUserInput {

  @Field({nullable: true})
  id: number

  @Field({nullable: true})
  @IsEmail()
  @IsEmailAlreadyExist({message: "email already used"})
  email: string

  @Field({nullable: true})
  password: string

  @Field({ nullable: true })
  nickname: string

  @Field()
  appUserGroupId: number

  @Field()
  appUserRoleId: number

  // @Field((type) => [PostCreateInput], { nullable: true })
  // posts: [PostCreateInput]
}

@Resolver(AppUser)
export class AppUserResolver {


  @Mutation((returns) => AppUser)
  async createUpdateAppUser(
    @Arg('data') data: AppUserInput,
    @Ctx() ctx: Context,
  ): Promise<APIResponse> {

   console.log(data.id, ctx.currentUser)

    //

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

      return {result: 'success', message: 'account details updated'}

    } else if (ctx.currentUser) {

      const appUserGroups = ctx.currentUser.appUserGroupRelationships
      let userIsAdminInTargetGroup = false
      // user has admin role in the appUserGroup
      for (let i=0;i<appUserGroups.length;i++) {
        if (appUserGroups[i].appUserGroupId === data.appUserGroupId && ctx.appRoles[appUserGroups[i].appUserRoleId] === "ADMIN") {
            userIsAdminInTargetGroup = true
            break;
        }
      }

      if (!userIsAdminInTargetGroup) throw new Error('Not permitted for this action')

      // check if target user has relation with target

      await ctx.prisma.appUserGroupRelationship.upsert({
        where: {
          appUserId_appUserRoleId_appUserGroupId: {
            appUserId: data.id,
            appUserGroupId: data.appUserGroupId,
            appUserRoleId: data.appUserRoleId
          }
        },
          update: {
            appUserRoleId: data.appUserRoleId,
            appUserGroupId: data.appUserGroupId,
        },
        create: {
          appUserId: data.id,
          appUserGroupId: data.appUserGroupId,
          appUserRoleId: data.appUserRoleId
        }
      })

      return {result: 'success'}
    }

    else {
      const hashedPassword = await bcrypt.hash(data.password, 10)
      const appUser = await ctx.prisma.appUser.create({
        data: {
          email: data.email,
          nickname: data?.nickname,
          //appUserGroupId: data.appUserGroupId && data.appUserGroupId,
          password: hashedPassword
        },
      })

      //option to create new appUserGroup with just single user in it

      const appUserGroupRelationship = await ctx.prisma.appUserGroupRelationship.create({
        data: {
          appUserId: appUser.id,
          appUserGroupId: data.appUserGroupId,
          appUserRoleId: data.appUserRoleId
        }
      })

      return {result: 'success', message: 'account created'}

      // return {...appUser, 
      //   appUserGroupId: appUserGroupRelationship.appUserGroupId, 
      //   appUserRoleId: appUserGroupRelationship.appUserRoleId} 
    }
    
     
    


  }
  @Mutation(() => AppUser, { nullable: true })
  async login(
    @Arg("data") data: AppUserLogin,
    @Ctx() ctx: Context
  ): Promise<AppUser | null> {
    const user = await ctx.prisma.appUser.findFirst({ where: { email:data.email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(data.password, user.password);

    if (!valid) {
      return null;
    }

    const { accessToken, refreshToken } = createTokens(user);

    ctx.res.cookie("refresh-token", refreshToken);
    ctx.res.cookie("access-token", accessToken);

    return user;
  }

  @Authorized(["MOD"]) 
  @Query(() => [AppUser])
  async allAppUsers(
    @Arg("data") data: AppUserGroupUniqueInput,
    @Ctx() ctx: Context) {
    return ctx.prisma.appUserGroupRelationship.findMany({where:{appUserGroupId : data.id}})
  }

}