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
import { Note } from "../types/Note";
import { Context } from "../helpers/context";
import { Status } from "../types/Status";

@Resolver(Note)
export class StatusResolver {
  @Authorized()
  @Query((returns) => [Status])
  async statusList(@Ctx() ctx: Context): Promise<Status[]> {
    return await ctx.prisma.status.findMany();
  }
}
