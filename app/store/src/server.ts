import { ApolloServer } from 'apollo-server'
import { DateTimeMock } from 'graphql-scalars'
// import { addMocksToSchema } from '@graphql-tools/mock';

import { resolvers } from '@store/resolvers'
import { environment } from '@store/environment'
import * as typeDefs from '@store/type-defs.graphql'

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: environment.apollo.introspection,
  mocks: {
    DateTime: DateTimeMock,
    Category: () => 'HEALTH',
  }, // TODO: Remove in PROD.
  mockEntireSchema: false, // TODO: Remove in PROD.
  playground: environment.apollo.playground,
})

server.listen(environment.port).then(({ url }) => console.log(`Server ready at ${url}. `))

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => server.stop())
}
