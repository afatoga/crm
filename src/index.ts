import 'reflect-metadata'
import * as tq from 'type-graphql'
//import { PostCreateInput, PostResolver, SortOrder } from './PostResolver'
import { AppUserResolver } from './AppUserResolver'
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
    resolvers: [AppUserResolver],
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
  })

  new ApolloServer({ schema, context: context, plugins: [ ApolloServerPluginLandingPageGraphQLPlayground(), ApolloServerPluginLandingPageDisabled() ] }).listen({ port: 4000 }, () =>
    console.log(`
🚀 Server ready at: http://localhost:4000
⭐️  See sample queries: http://pris.ly/e/ts/graphql-typegraphql#using-the-graphql-api`),
  )
}

app()