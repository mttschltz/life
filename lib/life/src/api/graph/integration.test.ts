import { JsonStore } from '@life/repo/json/service'
import { RiskMapper as RiskJsonMapper, newCategoryMapper } from '@life/repo/json/mapper'
import { ApolloServer } from 'apollo-server'
import { GraphService } from './service'
import { newCategoryInteractorFactory, newRiskInteractorFactory } from '@life/api/interactorFactory'
import { newGraphMapper } from './mapper'
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
      children: ['3'],
    },
    2: {
      id: '2',
      name: 'root category 2',
      path: '/root-category-2',
      description: 'root category 2 no children',
      children: [],
    },
    3: {
      id: '3',
      name: 'child category 3',
      path: '/child-category-3',
      description: 'child category 3 with child',
      children: ['4'],
      parentId: '1',
    },
    4: {
      id: '4',
      name: 'grandchild category 4',
      path: '/grandchild-category-4',
      description: 'grandchild category 4 with child',
      children: ['5'],
      parentId: '3',
    },
    5: {
      id: '5',
      name: 'greatgrandchild category 5',
      path: '/greatgrandchild-category-5',
      description: 'greatgrandchild category 5 no children',
      children: [],
      parentId: '4',
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
      newGraphMapper(transpile),
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
  describe('categories', () => {
    describe('Given a query for children and their parent', () => {
      const categoriesQuery = gql`
        query getCategories {
          categories {
            id
            path
            name
            description
            children {
              id
              path
              name
              description
              parent {
                id
                path
                name
                description
              }
            }
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
