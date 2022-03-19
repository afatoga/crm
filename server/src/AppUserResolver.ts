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
} from 'type-graphql'
//import { Post } from './Post'
import { AppUser } from './AppUser'
import { Context } from './context'
import { Prisma } from '@prisma/client'

//import { PostCreateInput } from './PostResolver'
@InputType()
class AppUserUniqueInput {
  @Field({ nullable: true })
  id: number

  @Field({ nullable: true })
  email: string
}

@InputType()
class AppUserInput {

  @Field({nullable: true})
  id: number

  @Field()
  email: string

  @Field({ nullable: true })
  nickname: string

  @Field({nullable: true})
  appUserGroupId: number

  // @Field((type) => [PostCreateInput], { nullable: true })
  // posts: [PostCreateInput]
}

@Resolver(AppUser)
export class AppUserResolver {
  // @FieldResolver()
  // async posts(@Root() appUser: AppUser, @Ctx() ctx: Context): Promise<Post[]> {
  //   return ctx.prisma.appUser
  //     .findUnique({
  //       where: {
  //         id: appUser.id,
  //       },
  //     })
  //     .posts()
  // }


    // const postData = data.posts?.map((post) => {
    //   return { title: post.title, content: post.content || undefined }
    // })
  @Mutation((returns) => AppUser)
  async createUpdateAppUser(
    @Arg('data') data: AppUserInput,
    @Ctx() ctx: Context,
  ): Promise<AppUser> {

    if (data.id) { //update
      return ctx.prisma.appUser.update({
        where: {
          id: data.id,
        },
        data: {
          email: data.email, // test could be null?
          nickname: data?.nickname,
          appUserGroupId: data.appUserGroupId
        }
      })
    }
    //try {
      return ctx.prisma.appUser.create({
        data: {
          email: data.email,
          nickname: data.nickname,
          appUserGroupId: data.appUserGroupId
          // posts: {
          //   create: postData,
          // },
        },
      })
    // } catch (e) {
      
    //   if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //     // The .code property can be accessed in a type-safe manner
    //     if (e.code === 'P2002') {
    //       console.log(
    //         'There is a unique constraint violation, a new user cannot be created with this email'
    //       )
    //     }
    //     return e;
    //   }
      
    // }


  }

  @Query(() => [AppUser])
  async allAppUsers(@Ctx() ctx: Context) {
    return ctx.prisma.appUser.findMany()
  }

  // @Query((returns) => [Post], { nullable: true })
  // async draftsByAppUser(
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