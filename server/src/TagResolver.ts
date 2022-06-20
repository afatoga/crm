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
  Int,
} from "type-graphql";
import { Tag, ExtendedTag, ExtendedTagParty } from "./Tag";
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
class TagsByNameInput {
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
class DeleteTagPartyInput {
  @Field((type) => Int)
  partyId: number;
  @Field((type) => Int)
  tagId: number;
  @Field((type) => Int)
  appUserGroupId: number;
}

@InputType()
class SinglePartyTagsInput {
  @Field((type) => Int)
  partyId: number;
  @Field((type) => Int)
  appUserGroupId: number;
}

@InputType()
class TaggedPartiesInput {
  @Field((type) => Int)
  tagId: number;
  @Field((type) => Int)
  appUserGroupId: number;
}
@InputType()
class CreateTagPartyInput {
  @Field((type) => Int)
  tagId: number;
  @Field((type) => Int)
  partyId: number;
  @Field((type) => Int)
  appUserGroupId: number;
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
        id: data.id,
      },
      data: {
        name: createTagName(data.name),
        statusId: data?.statusId,
        appUserGroupId: data.appUserGroupId,
      },
    });
  }
  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => APIResponse)
  async deleteTagParty(
    @Arg("data") data: DeleteTagPartyInput,
    @Ctx() ctx: Context
  ): Promise<APIResponse> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    await ctx.prisma.tagParty.delete({
      where: {
        partyId_tagId: {
          partyId: data.partyId,
          tagId: data.tagId,
        },
      },
    });

    return {
      status: "SUCCESS",
      message: "party was untagged",
    };
  }

  @Authorized()
  @Query((returns) => Tag, { nullable: true })
  async tagById(
    @Arg("data") data: TagByAppUserGroupInput,
    @Ctx() ctx: Context
  ) {
    //let partyTypeName = data.partyTypeId === 1 ? `"Person"` : `"Organization"`

    const queryResultArray = await ctx.prisma.$queryRaw<[Tag]>(Prisma.sql`
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

  @Authorized()
  @Query((returns) => [Tag])
  async singlePartyTags(
    @Arg("data") data: SinglePartyTagsInput,
    @Ctx() ctx: Context
  ) {
    //ensure user is authorized
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    return ctx.prisma.$queryRaw<Tag[]>(Prisma.sql`
  SELECT "Tag".*
  FROM "TagParty"
  INNER JOIN "Tag" ON "TagParty"."tagId" = "Tag"."id"
    AND "Tag"."appUserGroupId" = ${data.appUserGroupId}
    AND ("Tag"."statusId" != 4 OR "Tag"."statusId" IS NULL)
  WHERE "TagParty"."partyId" = ${data.partyId}
`);
  }

  @Authorized()
  @Query((returns) => [ExtendedTagParty], { nullable: true })
  async taggedParties(
    @Arg("data") data: TaggedPartiesInput,
    @Ctx() ctx: Context
  ) {
    //ensure user is authorized
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    return ctx.prisma.$queryRaw<Tag[]>(Prisma.sql`
  SELECT CONCAT ("Person"."surname", ' ', "Person"."name") AS "personFullName", 
    "Organization"."name" AS "organizationName",
    "Party"."typeId",
    "TagParty"."partyId" 
  FROM "TagParty"
  INNER JOIN "Party" ON "TagParty"."partyId" = "Party"."id"
    AND "Party"."appUserGroupId" = ${data.appUserGroupId}
    AND ("Party"."statusId" != 4 OR "Party"."statusId" IS NULL)
  LEFT JOIN "Person" ON "TagParty"."partyId" = "Person"."partyId"
  LEFT JOIN "Organization" ON "TagParty"."partyId" = "Organization"."partyId"
  WHERE "TagParty"."tagId" = ${data.tagId}
`);

    // return ctx.prisma.tagParty
    //   .findMany({
    //     where: {
    //       partyId: data.partyId,
    //     },
    //     include: {
    //       tag: true,
    //     },
    //   })
    //   .then((foundItems) => {
    //     return foundItems.flatMap((item: any) => {
    //       return item.tag.appUserGroupId ===
    //         ctx.currentUser?.currentAppUserGroupId
    //         ? item.tag
    //         : [];
    //     });
    //   });
  }

  @Authorized()
  @Query((returns) => [ExtendedTag])
  async tagsByName(@Arg("data") data: TagsByNameInput, @Ctx() ctx: Context) {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    if (!data.searchedName.length) return [];

    const searchText = `%${data.searchedName.toLocaleLowerCase()}%`;

    const queryResultArray = await ctx.prisma.$queryRaw<
      [ExtendedTag]
    >(Prisma.sql`
      SELECT "Tag"."id", "Tag"."name"
      FROM "Tag"
      WHERE "Tag"."appUserGroupId" = ${data.appUserGroupId} 
      AND ("Tag"."statusId" != 4 OR "Tag"."statusId" IS NULL)
      AND LOWER("Tag"."name") LIKE ${searchText}
    `);

    return queryResultArray;
  }

  @Authorized(["MOD", "ADMIN"])
  @Mutation((returns) => APIResponse)
  async createTagParty(
    @Arg("data") data: CreateTagPartyInput,
    @Ctx() ctx: Context
  ): Promise<APIResponse> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    const tagPartyExists = await ctx.prisma.tagParty.findFirst({
      where: {
        tagId: data.tagId,
        partyId: data.partyId,
      },
    });

    if (tagPartyExists) throw new Error("relationship exists");

    const party = await ctx.prisma.party.findFirst({
      where: {
        OR: [{ statusId: { not: 4 } }, { statusId: null }],
        id: data.partyId,
        appUserGroupId: data.appUserGroupId, //ctx.currentUser.currentAppUserGroupId,
      },
    });
    const tag = await ctx.prisma.tag.findFirst({
      where: {
        OR: [{ statusId: { not: 4 } }, { statusId: null }],
        //statusId: {not: 4},
        id: data.tagId,
        appUserGroupId: data.appUserGroupId,
      },
    });

    if (!party || !tag) throw new Error("party or tag are invalid");

    await ctx.prisma.tagParty.create({
      data: {
        partyId: party.id,
        tagId: tag.id,
      },
    });

    return {
      status: "SUCCESS",
      message: "party was tagged",
    };
  }
}
