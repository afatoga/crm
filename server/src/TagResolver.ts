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
  Int
} from "type-graphql";
import { Tag, ExtendedTag } from "./Tag";
import { APIResponse } from "./GlobalObjects";
import { Context, ICurrentUser } from "./context";
import { isUserAuthorized } from "./authChecker";
import { Prisma } from "@prisma/client";

@InputType()
class TagInput {
  @Field((type) => Int, { nullable: true })
  id: number;

  @Field((type) => Int, { nullable: true })
  statusId: number;

  @Field((type) => String)
  name: string;

  @Field((type) => Int, { nullable: true })
  partyId: number; //target

  @Field((type) => Int, { nullable: true })
  appUserGroupId: number;
}

@InputType() 
class TagByAppUserGroupInput {

  @Field((type) => Int)
  appUserGroupId: number;

  @Field((type) => Int, { nullable: true })
  id: number;

  @Field((type) => Int, { nullable: true })
  statusId: number;
}

@InputType()
class TagByNameInput {
  @Field((type) => String)
  searchedName: string;

  @Field((type) => Int)
  appUserGroupId: number;

  @Field((type) => Int, { nullable: true })
  statusId: number;
}
@InputType() 
class DeleteTagInput {
  @Field((type) => Int)
  id: number;
  @Field((type) => Int)
  appUserGroupId: number;
}

@InputType()
class PartyTagsInput {
  @Field()
  partyId: number;
}

const createTagName = (name: string) => {
  //let result = name.toLowerCase();

  let result = name
    .replace(new RegExp("\\s", "g"), "")
    .replace(new RegExp("[àáâãäå]", "g"), "a")
    .replace(new RegExp("æ", "g"), "ae")
    .replace(new RegExp("[çč]", "g"), "c")
    .replace(new RegExp("[ď]", "g"), "d")
    .replace(new RegExp("[èéêëě]", "g"), "e")
    .replace(new RegExp("[ìíîï]", "g"), "i")
    .replace(new RegExp("ñň", "g"), "n")
    .replace(new RegExp("[òóôõö]", "g"), "o")
    .replace(new RegExp("œ", "g"), "oe")
    .replace(new RegExp("ř", "g"), "r")
    .replace(new RegExp("š", "g"), "s")
    .replace(new RegExp("ť", "g"), "t")
    .replace(new RegExp("[ùúûüů]", "g"), "u")
    .replace(new RegExp("[ýÿ]", "g"), "y")
    .replace(new RegExp("[ž]", "g"), "z")
    .replace(new RegExp("\\W", "g"), "");

  return result.length > 32 ? result.slice(0, 32) : result;
};

//@Service()
@Resolver(Tag)
export class TagResolver {

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => Tag)
  async createTag(
    @Arg("data") data: TagInput,
    @Ctx() ctx: Context
  ): Promise<Tag> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    return await ctx.prisma.tag.create({
      data: {
        name: createTagName(data.name),
        statusId: data?.statusId,
        appUserGroupId: data.appUserGroupId,
      },
    });
  }

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => Tag)
  async updateTag(
    @Arg("data") data: TagInput,
    @Ctx() ctx: Context
  ): Promise<Tag> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    return await ctx.prisma.tag.update({
      where: {
        id: data.id
      },
      data: {
        name: createTagName(data.name),
        statusId: data?.statusId,
        appUserGroupId: data.appUserGroupId,
      },
    });
  }

  @Authorized()
  @Query((returns) => Tag, { nullable: true })
  async tagById(
    @Arg("data") data: TagByAppUserGroupInput,
    @Ctx() ctx: Context
  ) {
    //let partyTypeName = data.partyTypeId === 1 ? `"Person"` : `"Organization"`

    const queryResultArray = await ctx.prisma.$queryRaw<
      [Tag]
    >(Prisma.sql`
      SELECT "Tag".*
      FROM "Tag"
      WHERE "Tag"."appUserGroupId" = ${data.appUserGroupId}
      AND "Tag"."id" = ${data.id}
    `);

    if (!queryResultArray.length) return null;
    return queryResultArray[0];
  }

  @Authorized()
  @Query((returns) => [ExtendedTag])
  async tagsByAppUserGroup(
    @Arg("data") data: TagByAppUserGroupInput,
    @Ctx() ctx: Context
  ) {

    //ensure user is authorized
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    let statusCondition = data.statusId
      ? Prisma.sql`AND "Tag"."statusId" = ${data.statusId}`
      : Prisma.empty;

    return ctx.prisma.$queryRaw<ExtendedTag[]>(Prisma.sql`
      SELECT "Tag".*, "Status"."name" AS "statusName"
      FROM "Tag"
      LEFT JOIN "Status" ON "Tag"."statusId" = "Status"."id"
      WHERE "Tag"."appUserGroupId" = ${data.appUserGroupId}
      AND ("Tag"."statusId" != 4 OR "Tag"."statusId" IS NULL)
      ${statusCondition}
    `);
  }
  

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => APIResponse || Tag)
  async createUpdateTag(
    @Arg("data") data: TagInput,
    @Ctx() ctx: Context
  ): Promise<APIResponse | Tag> {

    if (!ctx.currentUser) throw new Error("Only for logged in users");

    if (data.partyId) {
      let target = await ctx.prisma.party.findFirst({
        where: {
          id: data.partyId,
          appUserGroupId: ctx.currentUser.currentAppUserGroupId,
        },
      });

      //look for target object

      if (!target) throw new Error("Target party does not exist");
    }

    if (data.operation === 'UPDATE') {
      if (!data.id) throw new Error("fill tag id");

      let currentTag = await ctx.prisma.tag.findFirst({
        where: {
          id: data.id,
          appUserGroupId: ctx.currentUser.currentAppUserGroupId,
        },
      });

      if (!currentTag)
        throw new Error(
          "tag does not exist or you are not authorized to update"
        );

     

      await ctx.prisma.tag.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name && createTagName(data.name),
          statusId: data.statusId ? data.statusId : undefined,
        },
      });



      return { status: 'SUCCESS', message: "tag was updated" };
    } else if (data.operation === 'CREATE') {
      if (!data.name || !data.name.length) throw new Error("tag name is required");

      // check if unique name
      let currentTag = await ctx.prisma.tag.findFirst({
        where: {
          name: createTagName(data.name),
          appUserGroupId: ctx.currentUser.currentAppUserGroupId,
        },
      });

      if (!currentTag) {
        //create
        currentTag = await ctx.prisma.tag.create({
          data: {
            name: createTagName(data.name),
            statusId: data.statusId ? data.statusId : undefined,
            appUserGroupId: ctx.currentUser.currentAppUserGroupId,
          },
        });
      }

      if (data.partyId) { // assign tag to party
        
        const relationExist = await ctx.prisma.tagParty.findUnique({
          where: {
            partyId_tagId: {
              partyId: data.partyId,
              tagId: currentTag.id,
            },
          },
        });
  
        if (data.partyId && !relationExist)
          await ctx.prisma.tagParty.create({
            data: {
              partyId: data.partyId,
              tagId: currentTag.id,
            },
          });
      
      }

      return currentTag;
      //return { status: "SUCCESS", message: "tag was created" };
    }

    else  if (data.operation === 'DELETE') {

      if (!data.id) throw new Error("fill tag id");

      //delete relationships

      await ctx.prisma.tagParty.deleteMany({
        where: {
          tagId: data.id,
        },
      });

      await ctx.prisma.noteTag.deleteMany({
        where: {
          tagId: data.id,
        },
      });

      // delete tag
      return await ctx.prisma.tag.delete({
        where: {
          id: data.id,
        },
      });

      // return {
      //   status: "SUCCESS",
      //   message: "tag and its relations were deleted",
      // };
    }

    throw new Error('invalid request')
  }

  @Authorized()
  @Query((returns) => [Tag], { nullable: true })
  async singlePartyTags(
    @Arg("data") data: PartyTagsInput,
    @Ctx() ctx: Context
  ) {
    if (!ctx.currentUser) throw new Error("Only for logged in users");

    return ctx.prisma.tagParty
      .findMany({
        where: {
          partyId: data.partyId,
        },
        include: {
          tag: true,
        },
      })
      .then((foundItems) => {
        return foundItems.flatMap((item: any) => {
          return item.tag.appUserGroupId ===
            ctx.currentUser?.currentAppUserGroupId
            ? item.tag
            : [];
        });
      });
  }

  // appUserGroupId:
  //    data.appUserGroupId &&
  //    isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
  //    ? data.appUserGroupId
  //    : undefined,
}
