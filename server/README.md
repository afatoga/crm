# Backend: Apollo Server with Prisma ORM and PostgreSQL

- DB model was created via [Prisma](https://www.prisma.io/) `/prisma/schema.prisma`.
- Prisma DB connection config is located in the same file, DB migration commands could be found in the [official documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push).
- Types, Resolvers and Authentication was written using [TypeGraphQL framework](https://typegraphql.com/).
- Auth is solved via JWT, helpers could be found in `src/helpers/auth*`.
- GraphQL API is served by Apollo Server 3.
- GraphQL Playground is present and could be switched on in `/src/index.ts`, look for 'ApolloServerPluginLandingPageGraphQLPlayground'.
