import "reflect-metadata";
import {
  Resolver,
  Query,
  //Mutation,
  Arg,
  Ctx,
  InputType,
  Int,
  Field,
  Authorized,
} from "type-graphql";
import { Prisma } from "@prisma/client";
import { SearchResult, SearchResponse } from "./GlobalObjects";
import { isUserAuthorized } from "./authChecker";
import { Context } from "./context";

@InputType()
class SearchInput {
  @Field((type) => String)
  searchedText: string;

  @Field((type) => Int)
  appUserGroupId: number;
}

@Resolver()
export class SearchResolver {
  @Authorized()
  @Query((returns) => SearchResponse)
  async searchResults(
    @Arg("data") data: SearchInput,
    @Ctx() ctx: Context
  ): Promise<SearchResponse> {
    if (
      !ctx.currentUser ||
      !isUserAuthorized(ctx.currentUser, data.appUserGroupId, ctx.appRoles)
    )
      throw new Error("Not authorized");

    const searchText = `%${data.searchedText.toLocaleLowerCase()}%`;

    const partyResultArray = await ctx.prisma.$queryRaw<
      [SearchResult]
    >(Prisma.sql`
        SELECT
          "Organization"."partyId" AS "id",
          'Organization' AS "entity",
          "Organization"."name" AS "searchedValue"
          --"Party"."typeId" AS "partyTypeId"
        FROM "Organization"
        INNER JOIN "Party" ON "Party"."id" = "Organization"."partyId"
          AND ("Party"."statusId" != 4 OR "Party"."statusId" IS NULL)
        WHERE "Party"."appUserGroupId" = ${data.appUserGroupId}
        AND LOWER("Organization"."name") LIKE ${searchText}
          UNION ALL
        SELECT
          "Person"."partyId" as "id",
          'Person' AS "entity",
          CONCAT ("Person"."surname", ' ', "Person"."name") AS "searchedValue"
          --"Party"."typeId" AS "partyTypeId"
        FROM "Person"
        INNER JOIN "Party" ON "Party"."id" = "Person"."partyId"
          AND ("Party"."statusId" != 4 OR "Party"."statusId" IS NULL)
        WHERE "Party"."appUserGroupId" = ${data.appUserGroupId}
        AND (LOWER("Person"."name") LIKE ${searchText}
          OR LOWER("Person"."surname") LIKE ${searchText}
        )
      `);

    const tagResultArray = await ctx.prisma.$queryRaw<
      [SearchResult]
    >(Prisma.sql`
        SELECT
          "Tag"."id" AS "id",
          'Tag' AS "entity",
          "Tag"."name" AS "searchedValue"
        FROM "Tag"
        WHERE "Tag"."appUserGroupId" = ${data.appUserGroupId}
        AND ("Tag"."statusId" != 4 OR "Tag"."statusId" IS NULL)
        AND LOWER("Tag"."name") LIKE ${searchText}
      `);

    const contactResultArray = await ctx.prisma.$queryRaw<
      [SearchResult]
    >(Prisma.sql`
        SELECT
          "Contact"."id" AS "id",
          'Contact' AS "entity",
          "Contact"."value" AS "searchedValue",
          "Party"."id" AS "contactPartyId",
          "Party"."typeId" AS "contactPartyTypeId"
        FROM "Contact"
        INNER JOIN "Party" ON "Contact"."mainPartyId" = "Party"."id"
          AND ("Party"."statusId" != 4 OR "Party"."statusId" IS NULL)
        WHERE "Contact"."appUserGroupId" = ${data.appUserGroupId}
        AND ("Contact"."statusId" != 4 OR "Contact"."statusId" IS NULL)
        AND LOWER("Contact"."value") LIKE ${searchText}
      `);

    const joinedResults = [
      ...partyResultArray,
      ...tagResultArray,
      ...contactResultArray,
    ];

    return {
      status: "SUCCESS",
      results: joinedResults,
      count: joinedResults.length,
    };
  }
}
