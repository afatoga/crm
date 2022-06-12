import "reflect-metadata";
//import Container from 'typedi'
import * as tq from "type-graphql";
//import { PostCreateInput, PostResolver, SortOrder } from './PostResolver'
import { AppUserResolver } from "./AppUserResolver";
import { PartyResolver } from "./PartyResolver";
import { ApolloServer } from "apollo-server";
import { DateTimeResolver } from "graphql-scalars";
import { context } from "./context";
import { GraphQLScalarType } from "graphql";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import { authChecker } from "./authChecker";
import { ErrorLoggerMiddleware } from "./middleware/errorLogger";
import { NoteResolver } from "./NoteResolver";
import { TagResolver } from "./TagResolver";
import { ContactResolver } from "./ContactResolver";
import { StatusResolver } from "./StatusResolver";

const app = async () => {
  //   tq.registerEnumType(SortOrder, {
  //     name: 'SortOrder',
  //   })

  const schema = await tq.buildSchema({
    resolvers: [
      AppUserResolver,
      ContactResolver,
      PartyResolver,
      NoteResolver,
      TagResolver,
      StatusResolver,
    ],
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    authChecker, // register auth checking function
    //globalMiddlewares: [ErrorLoggerMiddleware],
    //container: Container
    emitSchemaFile: {
      path: __dirname + "/schema.gql",
      commentDescriptions: true,
      sortedSchema: false, // by default the printed schema is sorted alphabetically
    },
  });

  new ApolloServer({
    // cors: {
    //   origin: "*", // <- allow request from all domains
    //   credentials: true,
    // },
    schema,
    context: context,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginLandingPageDisabled(),
    ],
  }).listen({ port: process.env.PORT }, () =>
    console.log(`Server ready at port 4000`)
  );
};

app();
