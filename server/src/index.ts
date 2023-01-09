import "reflect-metadata";
import * as tq from "type-graphql";
import { AppUserResolver } from "./resolvers/AppUserResolver";
import { PartyResolver } from "./resolvers/PartyResolver";
import { ApolloServer } from "apollo-server";
import { DateTimeResolver } from "graphql-scalars";
import { context } from "./helpers/context";
import { GraphQLScalarType } from "graphql";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import { authChecker } from "./helpers/authChecker";
import { TagResolver } from "./resolvers/TagResolver";
import { ContactResolver } from "./resolvers/ContactResolver";
import { StatusResolver } from "./resolvers/StatusResolver";
import { SearchResolver } from "./resolvers/SearchResolver";

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [
      AppUserResolver,
      ContactResolver,
      PartyResolver,
      TagResolver,
      StatusResolver,
      SearchResolver,
    ],
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    authChecker, // register auth checking function
    emitSchemaFile: {
      path: __dirname + "/schema.gql",
      commentDescriptions: true,
      sortedSchema: false, // by default the printed schema is sorted alphabetically
    },
  });

  new ApolloServer({
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
