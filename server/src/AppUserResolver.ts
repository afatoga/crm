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
import { AppUser } from './AppUser'
import { Context } from './context'
import { Prisma } from '@prisma/client'
import { IsEmail } from 'class-validator'
import { IsEmailAlreadyExist } from './decorators/isEmailAlreadyExist'
import bcrypt from "bcryptjs";
import {createTokens} from './auth';

@InputType()
class AppUserUniqueInput {
  @Field({ nullable: true })
  id: number

  @Field({ nullable: true })
  email: string
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

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({message: "email already used"})
  email: string

  @Field({nullable: true})
  password: string

  @Field({ nullable: true })
  nickname: string

  @Field({nullable: true})
  appUserGroupId: number

  // @Field((type) => [PostCreateInput], { nullable: true })
  // posts: [PostCreateInput]
}

@Resolver(AppUser)
export class AppUserResolver {

  @Mutation((returns) => AppUser)
  async createUpdateAppUser(
    @Arg('data') data: AppUserInput,
    @Ctx() ctx: Context,
  ): Promise<AppUser> {

    const hashedPassword = await bcrypt.hash(data.password, 10);

    if (data.id) { //update

      return ctx.prisma.appUser.update({
        where: {
          id: data.id,
        },
        data: {
          email: data.email, // test could be null?
          nickname: data?.nickname,
          appUserGroupId: data.appUserGroupId,
          password: data.password && hashedPassword
        }
      })
    }
    //try {
      return ctx.prisma.appUser.create({
        data: {
          email: data.email,
          nickname: data?.nickname,
          appUserGroupId: data.appUserGroupId && data.appUserGroupId,
          password: hashedPassword
        },
      })
    


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

  @Authorized() 
  @Query(() => [AppUser])
  async allAppUsers(@Ctx() ctx: Context) {
    return ctx.prisma.appUser.findMany({where:{appUserGroupId : ctx.user.appUserGroupId}})
  }

  // @Query((returns) => [Post], { nullable: true })
  // async notesByAppUser(
  //   @Arg('appUserUniqueInput') appUserUniqueInput: AppUserUniqueInput,
  //   @Ctx() ctx: Context,
  // ) {
  //   return ctx.prisma.appUser
  //     .findUnique({
  //       where: {
  //         id: appUserUniqueInput.id || undefined,
  //         email: appUserUniqueInput.email || undefined,
  //       },
  //     })
  //     .posts({
  //       where: {
  //         published: false,
  //       },
  //     })
  // }
}