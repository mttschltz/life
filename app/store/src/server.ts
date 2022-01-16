import { ApolloServer } from 'apollo-server'
import { environment } from '@store/environment'
import { GraphService } from '@life/api/graph/service'
import { newMapper } from '@life/api/graph/mapper'
import {
  newCategoryInteractorFactory,
  newRiskInteractorFactory,
  newUpdatedInteractorFactory,
} from '@life/api/interactorFactory'
import { newLogger } from '@util/logger'
import { transpile } from '@util/mdx'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { JsonStore } from '@life/repo/json/service'
import { RiskMapper as RiskJsonMapper, newCategoryMapper } from '@life/repo/json/mapper'
import { newCategoryRepoJson } from '@life/repo/json/category'
import { newUpdatedRepoJson } from '@life/repo/json/updated'
import { newRiskRepoJson } from '@life/repo/json/risk'

// Store/repo
const jsonStore: JsonStore = {
  category: {},
  risk: {},
}
const categoryRepo = newCategoryRepoJson(jsonStore, newCategoryMapper())
const riskRepo = newRiskRepoJson(jsonStore, new RiskJsonMapper())
const updatedRepo = newUpdatedRepoJson(categoryRepo, riskRepo)

// Interactors
const graphService = new GraphService(
  {
    category: newCategoryInteractorFactory(categoryRepo),
    risk: newRiskInteractorFactory(riskRepo),
    updated: newUpdatedInteractorFactory(updatedRepo),
  },
  newMapper(transpile),
  newLogger(),
)

// Server
const server = new ApolloServer({
  resolvers: graphService.resolvers(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  typeDefs: graphService.typeDefs(),
  introspection: environment.apollo.introspection,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
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
