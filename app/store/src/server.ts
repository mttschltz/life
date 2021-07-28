import { ApolloServer } from 'apollo-server'
import { DateTimeMock } from 'graphql-scalars'

import { environment } from '@store/environment'
import { GraphService } from '@life/service/graph/index'
import { ServiceFactory } from '@life/service/factory'
import { GraphMapper } from '@life/service/graph/mapper'
import { Category, Impact, Likelihood, RiskType } from '@life'
import { Logger } from '@util/logger'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'

// TODO: Remove seed data
const serviceFactory = new ServiceFactory({
  risk: {
    id: {
      id: 'id',
      category: Category.Security,
      impact: Impact.High,
      likelihood: Likelihood.High,
      name: 'name',
      notes: 'notes',
      type: RiskType.Goal,
      parentId: 'parentId',
    },
    parentId: {
      id: 'parentId',
      category: Category.Health,
      impact: Impact.Normal,
      name: 'parent risk',
      type: RiskType.Goal,
      likelihood: Likelihood.Normal,
      notes: 'parent notes',
    },
  },
})
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
