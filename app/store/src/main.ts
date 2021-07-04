import { ApolloServer } from 'apollo-server'

import { environment } from './environment'
import * as typeDefs from './type-defs.graphql'

const server = new ApolloServer({
  typeDefs,
  introspection: environment.apollo.introspection,
  mocks: true, // TODO: Remove in PROD.
  mockEntireSchema: false, // TODO: Remove in PROD.
  playground: environment.apollo.playground,
})

server.listen(environment.port).then(({ url }) => console.log(`Server ready at2 ${url}. `))

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => server.stop())
}
