import "reflect-metadata";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  Authorized,
} from "type-graphql";
import { APIResponse } from "../types/GlobalObjects";
import { AppUser, AppUserLoginResponse } from "../types/AppUser";
import { Context } from "../helpers/context";
import { IsEmail } from "class-validator";
import { IsEmailAlreadyExist } from "../decorators/isEmailAlreadyExist";
import bcrypt from "bcryptjs";
import { createTokens } from "../helpers/auth";

@InputType()
class AppUserGroupUniqueInput {
  @Field()
  id: number;
}

@InputType()
class createAppUserInput {
  @Field((type) => String)
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already used" })
  email: string;

  @Field((type) => String)
  nickname: string;

  @Field()
  password: string;
}

@InputType()
class AppUserLogin {
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
class AppUserInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already used" })
  email: string;

  @Field({ nullable: true, description: "password is not hashed yet" })
  password: string;

  @Field({ nullable: true })
  nickname: string;

  @Field({ nullable: true })
  appUserGroupId: number;

  @Field({ nullable: true })
  appUserRoleId: number;
}

@Resolver(AppUser)
export class AppUserResolver {
  @Mutation(() => APIResponse)
  async createAppUser(
    @Arg("data") data: createAppUserInput,
    @Ctx() ctx: Context
  ): Promise<APIResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await ctx.prisma.appUser.create({
      data: {
        email: data.email,
        nickname: data?.nickname,
        password: hashedPassword,
      },
    });

    return {
      status: "SUCCESS",
    };
  }

  @Mutation(() => APIResponse)
  async createUpdateAppUser(
    @Arg("data") data: AppUserInput,
    @Ctx() ctx: Context
  ): Promise<APIResponse> {
    if (
      ctx.currentUser &&
      ctx.currentUser.id === data.id &&
      data.password.length
    ) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      // user updates his profile

      await ctx.prisma.appUser.update({
        where: {
          id: data.id,
        },
        data: {
          email: data?.email,
          nickname: data?.nickname,
          password: hashedPassword,
        },
      });

      return { status: "SUCCESS", message: "account details updated" };
    } else if (ctx.currentUser) {
      // admin is setting a membership & role to regular user

      const appUserGroups = ctx.currentUser.appUserGroupRelationships;
      let userIsAdminInTargetGroup = false;

      for (let i = 0; i < appUserGroups.length; i++) {
        if (
          appUserGroups[i].appUserGroupId === data.appUserGroupId &&
          ctx.appRoles[appUserGroups[i].appUserRoleId] === "ADMIN"
        ) {
          // user has admin role in the target group
          userIsAdminInTargetGroup = true;
          break;
        }
      }

      if (!userIsAdminInTargetGroup)
        throw new Error("Not permitted for this action");

      // remove existing roles in target group
      await ctx.prisma.appUserGroupRelationship.deleteMany({
        where: {
          appUserGroupId: data.appUserGroupId,
        },
      });

      // set new role

      if (data.appUserRoleId !== 0)
        await ctx.prisma.appUserGroupRelationship.create({
          data: {
            appUserId: data.id,
            appUserGroupId: data.appUserGroupId,
            appUserRoleId: data.appUserRoleId,
          },
        });

      return { status: "SUCCESS", message: "membership and role were set" };
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const appUser = await ctx.prisma.appUser.create({
        data: {
          email: data.email.toLocaleLowerCase(),
          nickname: data?.nickname,
          password: hashedPassword,
        },
      });

      return { status: "SUCCESS", message: "account created" };
    }
  }
  @Query(() => AppUserLoginResponse)
  async login(
    @Arg("data") data: AppUserLogin,
    @Ctx() ctx: Context
  ): Promise<AppUserLoginResponse> {
    const user = await ctx.prisma.appUser.findFirst({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("invalid credentials");
    }

    const valid = await bcrypt.compare(data.password, user.password);

    if (!valid) {
      throw new Error("invalid credentials");
    }

    const { accessToken } = createTokens(user); //refreshToken TBI

    const appUserGroupRelationships =
      await ctx.prisma.appUserGroupRelationship.findMany({
        where: { appUserId: user.id },
      });

    return {
      appUser: {
        ...user,
        appUserGroupRelationships: appUserGroupRelationships,
      },
      accessToken,
    };
  }

  @Authorized(["MOD"])
  @Query(() => [AppUser])
  async allAppUsers(
    @Arg("data") data: AppUserGroupUniqueInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.appUserGroupRelationship.findMany({
      where: { appUserGroupId: data.id },
    });
  }
}
