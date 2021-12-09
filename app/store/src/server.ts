import { ApolloServer } from 'apollo-server'
import { DateTimeMock } from 'graphql-scalars'

import { environment } from '@store/environment'
import { GraphService } from '@life/api/graph/service'
import { newCategoryInteractorFactory, newRiskInteractorFactory } from '@life/api/interactorFactory'
import { newGraphMapper } from '@life/api/graph/mapper'
import { newLogger } from '@util/logger'
import { transpile } from '@util/mdx'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { JsonStore, RiskRepoJson } from '@life/repo/json/service'
import { RiskMapper as RiskJsonMapper, newCategoryMapper } from '@life/repo/json/mapper'
import { newCategoryRepoJson } from '@life/repo/json/category'

// Store/repo
const jsonStore: JsonStore = {
  category: {},
  risk: {},
}
const riskRepo = new RiskRepoJson(jsonStore, new RiskJsonMapper())
const categoryRepo = newCategoryRepoJson(jsonStore, newCategoryMapper())

// Interactors
const graphService = new GraphService(
  {
    category: newCategoryInteractorFactory(categoryRepo),
    risk: newRiskInteractorFactory(riskRepo),
  },
  newGraphMapper(transpile),
  newLogger(),
)

// Server
const server = new ApolloServer({
  resolvers: graphService.resolvers(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  typeDefs: graphService.typeDefs(),
  introspection: environment.apollo.introspection,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  mocks: {
    /* eslint-disable @typescript-eslint/naming-convention */
    DateTime: DateTimeMock,
    CategoryTopLevel: (): string => 'HEALTH',
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
