import { ApolloServer } from 'apollo-server'
import { DateTimeMock } from 'graphql-scalars'

import { environment } from '@store/environment'
import { GraphService } from '@life/api/graph/service'
import {
  newCategoryInteractorFactory,
  newRiskInteractorFactory,
  newUpdatedInteractorFactory,
} from '@life/api/interactorFactory'
import { newGraphMapper } from '@life/api/graph/mapper'
import { newLogger } from '@util/logger'
import { transpile } from '@util/mdx'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { JsonStore } from '@life/repo/json/service'
import { RiskMapper as RiskJsonMapper, newCategoryMapper } from '@life/repo/json/mapper'
import { newCategoryRepoJson } from '@life/repo/json/category'
import { newRiskRepoJson } from '@life/repo/json/risk'
import { CategoryTopLevel, Impact, Likelihood, RiskType } from '@life/risk'

// Store/repo
const jsonStore: JsonStore = {
  category: {
    1: {
      id: '1',
      name: 'root category 1',
      path: '/root-category-1',
      description: 'root category 1 with child',
      shortDescription: 'rc1 with child',
      children: ['3'],
      updated: new Date('2021-12-01'),
    },
    2: {
      id: '2',
      name: 'root category 2',
      path: '/root-category-2',
      description: 'root category 2 no children',
      shortDescription: 'rc2 with child',
      children: [],
      updated: new Date('2021-12-02'),
    },
    3: {
      id: '3',
      name: 'child category 3',
      path: '/child-category-3',
      description: 'child category 3 with child',
      shortDescription: 'cc3 with child',
      children: ['4'],
      parentId: '1',
      updated: new Date('2021-12-03'),
    },
    4: {
      id: '4',
      name: 'grandchild category 4',
      path: '/grandchild-category-4',
      description: 'grandchild category 4 with child',
      shortDescription: 'gc4 with child',
      children: ['5'],
      parentId: '3',
      updated: new Date('2021-12-04'),
    },
    5: {
      id: '5',
      name: 'greatgrandchild category 5',
      path: '/greatgrandchild-category-5',
      description: 'greatgrandchild category 5 no children',
      shortDescription: 'ggc5 with child',
      children: [],
      parentId: '4',
      updated: new Date('2021-12-05'),
    },
  },
  risk: {
    1: {
      id: '1',
      category: CategoryTopLevel.Health,
      impact: Impact.High,
      likelihood: Likelihood.High,
      name: 'risk 1 name',
      shortDescription: 'risk 1 short description',
      type: RiskType.Condition,
      updated: new Date('2021-12-06'),
    },
  },
}
const riskRepo = newRiskRepoJson(jsonStore, new RiskJsonMapper())
const categoryRepo = newCategoryRepoJson(jsonStore, newCategoryMapper())

// Interactors
const graphService = new GraphService(
  {
    category: newCategoryInteractorFactory(categoryRepo),
    risk: newRiskInteractorFactory(riskRepo),
    updated: newUpdatedInteractorFactory(),
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
