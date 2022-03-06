import 'reflect-metadata'
import * as tq from 'type-graphql'
//import { PostCreateInput, PostResolver, SortOrder } from './PostResolver'
import { AppUserResolver } from './AppUserResolver'
import { PartyResolver } from './PartyResolver'
import { ApolloServer } from 'apollo-server'
import { DateTimeResolver } from 'graphql-scalars'
import { context } from './context'
import { GraphQLScalarType } from 'graphql'
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'

const app = async () => {
//   tq.registerEnumType(SortOrder, {
//     name: 'SortOrder',
//   })

  const schema = await tq.buildSchema({
    resolvers: [AppUserResolver, PartyResolver],
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
  })

  new ApolloServer({ schema, context: context, plugins: [ ApolloServerPluginLandingPageGraphQLPlayground(), ApolloServerPluginLandingPageDisabled() ] }).listen({ port: process.env.PORT }, () =>
    console.log(`Server ready at port 4000`),
  )
}

app()