import { ApolloServer } from 'apollo-server'
import resolvers from './resolvers'
import typeDefs from './type-defs'

const server = new ApolloServer({ resolvers, typeDefs })

server.listen().then(({ url }) => console.log(`Server ready at ${url}. `))

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => console.log('Module disposed. '))
}
