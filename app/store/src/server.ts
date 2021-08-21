import { ApolloServer } from 'apollo-server'
import { DateTimeMock } from 'graphql-scalars'

import { environment } from '@store/environment'
import { GraphService } from '@life/api/graph/service'
import { InteractorFactory } from '@life/api/interactorFactory'
import { GraphMapper } from '@life/api/graph/mapper'
import { Logger } from '@util/logger'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'

const interactorFactory = new InteractorFactory({})
const graphService = new GraphService(interactorFactory, new GraphMapper(), Logger.new())

const server = new ApolloServer({
  resolvers: graphService.resolvers(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  typeDefs: graphService.typeDefs(),
  introspection: environment.apollo.introspection,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  mocks: {
    /* eslint-disable @typescript-eslint/naming-convention */
    DateTime: DateTimeMock,
    Category: (): string => 'HEALTH',
    /* eslint-enable @typescript-eslint/naming-convention */
  }, // TODO: Remove in PROD.
  mockEntireSchema: false, // TODO: Remove in PROD.
})

void server.listen(environment.port).then(({ url }) => {
  console.log(`Server ready at ${url}. `)
})

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    void server.stop()
  })
}
