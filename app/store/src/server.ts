import { ApolloServer } from 'apollo-server'
import { DateTimeMock } from 'graphql-scalars'

import { environment } from '@store/environment'
import { GraphService } from '@life/api/graph/service'
import { ServiceFactory } from '@life/api/factory'
import { GraphMapper } from '@life/api/graph/mapper'
import { Logger } from '@util/logger'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'

const serviceFactory = new ServiceFactory({})
const graphService = new GraphService(serviceFactory, new GraphMapper(), Logger.new())

const server = new ApolloServer({
  resolvers: graphService.resolvers(),
  typeDefs: graphService.typeDefs(),
  introspection: environment.apollo.introspection,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  mocks: {
    DateTime: DateTimeMock,
    Category: () => 'HEALTH',
  }, // TODO: Remove in PROD.
  mockEntireSchema: false, // TODO: Remove in PROD.
})

server.listen(environment.port).then(({ url }) => console.log(`Server ready at ${url}. `))

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => server.stop())
}
