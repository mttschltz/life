import { JsonStore } from '@life/repo/json/service'
import { RiskMapper as RiskJsonMapper, newCategoryMapper } from '@life/repo/json/mapper'
import { ApolloServer } from 'apollo-server'
import { GraphService } from './service'
import { newCategoryInteractorFactory, newRiskInteractorFactory } from '@life/api/interactorFactory'
import { newMapper } from './mapper'
import { newLogger } from '@util/logger'
import { transpile } from '@util/mdx'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { gql } from '@apollo/client/core'
import { CategoryRepoJson, newCategoryRepoJson } from '@life/repo/json/category'
import { newRiskRepoJson, RiskRepoJson } from '@life/repo/json/risk'

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
      shortDescription: 'ggc4 with child',
      children: [],
      parentId: '4',
      updated: new Date('2021-12-05'),
    },
  },
  risk: {},
}

describe('GraphServiceIntegration', () => {
  let riskRepo: RiskRepoJson
  let categoryRepo: CategoryRepoJson
  let graphService: GraphService
  let server: ApolloServer
  beforeAll(async () => {
    riskRepo = newRiskRepoJson(jsonStore, new RiskJsonMapper())
    categoryRepo = newCategoryRepoJson(jsonStore, newCategoryMapper())

    graphService = new GraphService(
      {
        category: newCategoryInteractorFactory(categoryRepo),
        risk: newRiskInteractorFactory(riskRepo),
      },
      newMapper(transpile),
      newLogger(),
    )

    server = new ApolloServer({
      resolvers: graphService.resolvers(),
      typeDefs: graphService.typeDefs(),
      introspection: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      mockEntireSchema: false,
    })

    await server.listen(4001)
  })
  afterAll(async () => {
    await server.stop()
  })
  describe('categories', () => {
    describe('Given a query for children and their parent', () => {
      const categoriesQuery = gql`
        query getCategories {
          categories {
            id
            path
            name
            description
            shortDescription
            children {
              id
              path
              name
              description
              shortDescription
              parent {
                id
                path
                name
                description
                shortDescription
                updated
              }
              updated
            }
            updated
          }
        }
      `
      test('Then 2 root categories and 1 child with parent are returned', async () => {
        const response = await server.executeOperation({
          query: categoriesQuery,
        })
        expect(response).toMatchSnapshot()
      })
    })
  })
})
