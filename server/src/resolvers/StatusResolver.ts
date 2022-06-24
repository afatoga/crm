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

//@Service()
@Resolver(Note)
export class StatusResolver {
  @Authorized()
  @Query((returns) => [Status])
  async statusList(@Ctx() ctx: Context): Promise<Status[]> {
    //if(!ctx.currentUser) throw new Error('Only for logged in users')

    return await ctx.prisma.status.findMany();
  }
}
