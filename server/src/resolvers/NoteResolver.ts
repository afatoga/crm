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
import { APIResponse } from "../types/GlobalObjects";
import { Context } from "../helpers/context";

@InputType()
class NoteInput {
  @Field({ nullable: true })
  id: number;

  @Field()
  content: string;

  @Field()
  noteTarget: "tag" | "party";

  @Field()
  noteTargetId: number;

  @Field({ nullable: true })
  isPrivate: boolean;
}

@InputType()
class TargetNotesInput {
  @Field()
  noteTarget: "tag" | "party";

  @Field()
  noteTargetId: number;
}

@Resolver(Note)
export class NoteResolver {
  @Authorized()
  @Mutation((returns) => APIResponse)
  async createUpdateNote(
    @Arg("data") data: NoteInput,
    @Ctx() ctx: Context
  ): Promise<APIResponse> {
    if (!ctx.currentUser) throw new Error("Only for logged in users");

    let target = null;
    if (data.noteTarget === "tag") {
      target = await ctx.prisma.tag.findFirst({
        where: {
          id: data.noteTargetId,
          appUserGroupId: ctx.currentUser.currentAppUserGroupId,
        },
      });
    } else if (data.noteTarget === "party") {
      target = await ctx.prisma.party.findFirst({
        where: {
          id: data.noteTargetId,
          appUserGroupId: ctx.currentUser.currentAppUserGroupId,
        },
      });
    }

    if (!target) throw new Error("Note target is not defined");

    if (data.id) {
      //update

      let currentNote = await ctx.prisma.note.findFirst({
        where: {
          id: data.id,
          appUserId: ctx.currentUser.id,
        },
      });

      if (!currentNote)
        throw new Error(
          "note does not exist or you are not authorized to update"
        );

      if (!data.content.length) {
        //delete relationship

        if (data.noteTarget === "tag")
          await ctx.prisma.noteTag.delete({
            where: {
              tagId_noteId: { tagId: data.noteTargetId, noteId: data.id },
            },
          });

        if (data.noteTarget === "party")
          await ctx.prisma.noteParty.delete({
            where: {
              partyId_noteId: { partyId: data.noteTargetId, noteId: data.id },
            },
          });

        // delete note

        await ctx.prisma.note.delete({
          where: {
            id: data.id,
          },
        });

        return { status: "SUCCESS", message: "note was deleted" };
      }

      await ctx.prisma.note.update({
        where: {
          id: data.id,
        },
        data: {
          content: data.content,
          appUserGroupId: data.isPrivate
            ? null
            : ctx.currentUser.currentAppUserGroupId,
        },
      });

      return { status: "SUCCESS", message: "note was updated" };
    } else {
      //create

      const createdNote = await ctx.prisma.note.create({
        data: {
          content: data.content,
          appUserId: ctx.currentUser.id,
          appUserGroupId: data.isPrivate
            ? null
            : ctx.currentUser.currentAppUserGroupId,
        },
      });

      if (!createdNote) throw new Error("note was not created");

      if (data.noteTarget === "tag")
        await ctx.prisma.noteTag.create({
          data: {
            tagId: data.noteTargetId,
            noteId: createdNote.id,
          },
        });

      if (data.noteTarget === "party")
        await ctx.prisma.noteParty.create({
          data: {
            partyId: data.noteTargetId,
            noteId: createdNote.id,
          },
        });

      return { status: "SUCCESS", message: "note was created" };
    }
  }

  public retrieveNotes = (foundItems: any, currentUserId: number) => {
    return foundItems.flatMap((item: any) => {
      return item.note.appUserId === currentUserId ? item.note : [];
    });
  };

  @Authorized()
  @Query((returns) => [Note], { nullable: true })
  async singlePartyNotes(
    @Arg("data") data: TargetNotesInput,
    @Ctx() ctx: Context
  ) {
    if (!ctx.currentUser) throw new Error("Only for logged in users");
    const currentUserId = ctx.currentUser.id;

    if (data.noteTarget === "tag") {
      return ctx.prisma.noteTag
        .findMany({
          where: {
            tagId: data.noteTargetId,
          },
          include: {
            note: true,
          },
        })
        .then((foundItems) => this.retrieveNotes(foundItems, currentUserId));
    } else if (data.noteTarget === "party") {
      return ctx.prisma.noteParty
        .findMany({
          where: {
            partyId: data.noteTargetId,
          },
          include: {
            note: true,
          },
        })
        .then((foundItems) => this.retrieveNotes(foundItems, currentUserId));
    }
  }
}
