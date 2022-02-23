import { JsonStore } from '@life/repo/json/service'
import { RiskMapper as RiskJsonMapper, newCategoryMapper } from '@life/repo/json/mapper'
import { ApolloServer } from 'apollo-server'
import { GraphService } from './service'
import { newMapper } from './mapper'
import {
  newCategoryInteractorFactory,
  newRiskInteractorFactory,
  newUpdatedInteractorFactory,
} from '@life/api/interactorFactory'
import { newLogger } from '@helper/logger'
import { transpile } from '@helper/mdx'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { gql } from '@apollo/client/core'
import { CategoryRepoJson, newCategoryRepoJson } from '@life/repo/json/category'
import { newRiskRepoJson, RiskRepoJson } from '@life/repo/json/risk'
import { UpdatedRepo as UpdatedRepoJson } from '@life/repo'
import { newUpdatedRepoJson } from '@life/repo/json/updated'
import { Impact, CategoryTopLevel, Likelihood, RiskType } from '@life/risk'

const jsonStore: JsonStore = {
  category: {
    1: {
      id: '1',
      name: 'root category 1',
      slug: 'root-category-1',
      previousSlugs: ['old-root-category-1'],
      path: '/root-category-1',
      previousPaths: ['/old-root-category-1'],
      description: 'root category 1 with child',
      shortDescription: 'rc1 with child',
      children: ['3'],
      updated: new Date('2021-12-01'),
    },
    2: {
      id: '2',
      name: 'root category 2',
      slug: 'root-category-2',
      previousSlugs: [],
      path: '/root-category-2',
      previousPaths: [],
      description: 'root category 2 no children',
      shortDescription: 'rc2 with child',
      children: [],
      updated: new Date('2021-12-02'),
    },
    3: {
      id: '3',
      name: 'child category 3',
      slug: 'child-category-3',
      previousSlugs: ['old-child-category-3'],
      path: '/child-category-3',
      previousPaths: ['/old-child-category-3'],
      description: 'child category 3 with child',
      shortDescription: 'cc3 with child',
      children: ['4'],
      parentId: '1',
      updated: new Date('2021-12-03'),
    },
    4: {
      id: '4',
      name: 'grandchild category 4',
      slug: 'grandchild-category-4',
      previousSlugs: [],
      path: '/grandchild-category-4',
      previousPaths: [],
      description: 'grandchild category 4 with child',
      shortDescription: 'gc4 with child',
      children: ['5'],
      parentId: '3',
      updated: new Date('2021-12-04'),
    },
    5: {
      id: '5',
      name: 'greatgrandchild category 5',
      slug: 'greatgrandchild-category-5',
      previousSlugs: [],
      path: '/greatgrandchild-category-5',
      previousPaths: [],
      description: 'greatgrandchild category 5 no children',
      shortDescription: 'ggc4 with child',
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
      name: 'risk name 1',
      shortDescription: 'risk short description 1',
      type: RiskType.Condition,
      updated: new Date('2021-12-03'),
    },
    2: {
      id: '2',
      category: CategoryTopLevel.Health,
      impact: Impact.High,
      likelihood: Likelihood.High,
      name: 'risk name 2',
      shortDescription: 'risk short description 2',
      type: RiskType.Condition,
      updated: new Date('2021-12-04'),
      notes: 'risk notes 2',
      parentId: '1',
    },
  },
}

describe('GraphServiceIntegration', () => {
  let categoryRepo: CategoryRepoJson
  let riskRepo: RiskRepoJson
  let updatedRepo: UpdatedRepoJson
  let graphService: GraphService
  let server: ApolloServer
  beforeAll(async () => {
    categoryRepo = newCategoryRepoJson(jsonStore, newCategoryMapper())
    riskRepo = newRiskRepoJson(jsonStore, new RiskJsonMapper())
    updatedRepo = newUpdatedRepoJson(categoryRepo, riskRepo)

    graphService = new GraphService(
      {
        category: newCategoryInteractorFactory(categoryRepo),
        risk: newRiskInteractorFactory(riskRepo),
        updated: newUpdatedInteractorFactory(updatedRepo),
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
            slug
            previousSlugs
            name
            description
            shortDescription
            children {
              id
              slug
              previousSlugs
              name
              description
              shortDescription
              parent {
                id
                slug
                previousSlugs
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
  describe('updated', () => {
    describe('Given a query with type-specific data', () => {
      const categoriesQuery = gql`
        query getUpdated {
          updated {
            id
            name
            shortDescription
            updated
            ... on Category {
              slug
              previousSlugs
              description
              parent {
                id
                slug
                previousSlugs
                name
                description
                shortDescription
                updated
              }
              children {
                id
                slug
                previousSlugs
                name
                description
                shortDescription
                updated
                parent {
                  id
                  slug
                  previousSlugs
                  name
                  description
                  shortDescription
                  updated
                }
              }
            }
            ... on Risk {
              category
              impact
              likelihood
              notes
              type
              parent {
                id
                category
                impact
                likelihood
                name
                notes
                type
                shortDescription
                updated
              }
            }
          }
        }
      `
      test('Then all categories and risks are returned with most recent updated first', async () => {
        const response = await server.executeOperation({
          query: categoriesQuery,
        })
        expect(response).toMatchSnapshot()
      })
    })
  })
})
