import { Category as CategoryUsecase, Risk as RiskUsecase, Updated as UpdatedUsecase } from '@life/usecase/mapper'
import {
  Resolver,
  ResolverFn,
  Category,
  Risk,
  CategoryTopLevel,
  Impact,
  Likelihood,
  RiskType,
} from '@life/__generated__/graphql'
import { Logger } from '@helper/logger'
import { Result, resultError, resultOk, Results, resultsError, resultsOk } from '@helper/result'
import { GraphQLResolveInfo, Kind, ValueNode } from 'graphql'
import { GraphMapper } from './mapper'

import { GraphService, InteractorFactory } from './service'
import { mockDeep, MockedDeep } from '@helper/mock'
import { FetchParentInteractor } from '@life/usecase/category/fetchParent'
import { ListChildrenInteractor } from '@life/usecase/category/listChildren'
import { ListInteractor as ListCategoriesInteractor } from '@life/usecase/category/list'
import { ListInteractor as ListUpdatedInteractor } from '@life/usecase/updated/list'

function assertResolverFn<Result, Parent, Context, Args>(
  resolver: Resolver<Result, Parent, Context, Args> | undefined,
): asserts resolver is ResolverFn<Result, Parent, Context, Args> {
  if (!resolver || typeof resolver !== 'function') {
    throw new Error('Not a ResolverFn')
  }
}

describe('GraphService', () => {
  describe('resolvers', () => {
    let factory: MockedDeep<InteractorFactory>
    let logger: MockedDeep<Logger>
    let mapper: MockedDeep<GraphMapper>
    let fetchParent: jest.MockedFunction<FetchParentInteractor['fetchParent']>
    let listChildren: jest.MockedFunction<ListChildrenInteractor['listChildren']>
    let listCategories: jest.MockedFunction<ListCategoriesInteractor['list']>
    let listUpdated: jest.MockedFunction<ListUpdatedInteractor['list']>
    beforeEach(() => {
      factory = mockDeep<InteractorFactory>()
      fetchParent = jest.fn()
      factory.category.fetchParentInteractor.mockReturnValue({
        fetchParent,
      })
      listChildren = jest.fn()
      factory.category.listChildrenInteractor.mockReturnValue({
        listChildren: listChildren,
      })
      listCategories = jest.fn()
      factory.category.listInteractor.mockReturnValue({
        list: listCategories,
      })
      listUpdated = jest.fn()
      factory.updated.listInteractor.mockReturnValue({
        list: listUpdated,
      })
      logger = mockDeep<Logger>()
      mapper = mockDeep<GraphMapper>()
    })
    describe('Category', () => {
      describe('parent', () => {
        describe('Given a category with a parent', () => {
          let categoryWithParent: Category
          let fetchedParent: CategoryUsecase
          let mappedParent: Category
          beforeEach(() => {
            categoryWithParent = {
              id: 'the id',
              name: 'the name',
              slug: 'the slug',
              previousSlugs: ['the', 'previous', 'slugs'],
              path: '/the path',
              previousPaths: ['/previous 1', '/previous 2'],
              description: 'the description',
              shortDescription: 'the short description',
              parent: undefined, // Hasn't been loaded yet
              children: [],
              updated: new Date(),
            }
            fetchedParent = {
              id: 'fetch id',
              name: 'fetch name',
              slug: 'fetch slug',
              previousSlugs: [],
              path: '/fetch path',
              previousPaths: [],
              shortDescription: 'fetch short description',
              children: [],
              updated: new Date(),
            }
            fetchParent.mockReturnValueOnce(Promise.resolve(resultOk<CategoryUsecase>(fetchedParent)))
            mappedParent = {
              id: 'mapped id',
              name: 'mapped name',
              slug: 'mapped slug',
              path: '/mapped path',
              previousPaths: ['/mapped previous 1', '/mapped previous 2'],
              previousSlugs: [],
              shortDescription: 'mapped short description',
              children: [],
              updated: new Date(),
            }
            mapper.categoryFromUsecase.mockReturnValueOnce(mappedParent)
          })
          describe('When everything succeeds', () => {
            test('Then the mapped parent is returned', async () => {
              const service = new GraphService(factory, mapper, logger)
              const parent = service.resolvers().Category?.parent
              assertResolverFn(parent)
              const result = await parent(categoryWithParent, {}, {}, {} as GraphQLResolveInfo)
              expect(result).toBe(mappedParent)
            })
            test('Then the fetchParent interactor is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const parent = service.resolvers().Category?.parent
              assertResolverFn(parent)
              await parent(categoryWithParent, {}, {}, {} as GraphQLResolveInfo)
              expect(fetchParent.mock.calls).toHaveLength(1)
              expect(fetchParent.mock.calls[0]).toEqual(['the id'])
            })
            test('Then the mapper is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const parent = service.resolvers().Category?.parent
              assertResolverFn(parent)
              await parent(categoryWithParent, {}, {}, {} as GraphQLResolveInfo)
              expect(mapper.categoryFromUsecase.mock.calls).toHaveLength(1)
              expect(mapper.categoryFromUsecase.mock.calls[0]).toEqual([fetchedParent])
            })
            test('Then the result is not logged', async () => {
              const service = new GraphService(factory, mapper, logger)
              const parent = service.resolvers().Category?.parent
              assertResolverFn(parent)
              await parent(categoryWithParent, {}, {}, {} as GraphQLResolveInfo)
              expect(logger.result.mock.calls).toHaveLength(0)
            })
          })
          describe('When fetching the parent errors', () => {
            let errorResult: Result<CategoryUsecase>
            beforeEach(() => {
              errorResult = resultError<CategoryUsecase>('fetch error')
              fetchParent.mockReset()
              fetchParent.mockReturnValueOnce(Promise.resolve(errorResult))
            })
            test('Then the error logged and thrown', async () => {
              const service = new GraphService(factory, mapper, logger)
              const parent = service.resolvers().Category?.parent
              assertResolverFn(parent)
              await expect(parent(categoryWithParent, {}, {}, {} as GraphQLResolveInfo)).rejects.toThrow('fetch error')
              expect(logger.result.mock.calls).toHaveLength(1)
              expect(logger.result.mock.calls[0]).toEqual([errorResult])
            })
          })
          describe('When fetching the parent errors with no stacktrace', () => {
            let errorResult: Result<CategoryUsecase>
            beforeEach(() => {
              errorResult = resultError<CategoryUsecase>('fetch error with no stacktrace', {
                message: 'error message',
                name: 'error name',
              })
              fetchParent.mockReset()
              fetchParent.mockReturnValueOnce(Promise.resolve(errorResult))
            })
            test('Then the error logged and thrown', async () => {
              const service = new GraphService(factory, mapper, logger)
              const parent = service.resolvers().Category?.parent
              assertResolverFn(parent)
              await expect(parent(categoryWithParent, {}, {}, {} as GraphQLResolveInfo)).rejects.toThrow(
                'fetch error with no stacktrace',
              )
              expect(logger.result.mock.calls).toHaveLength(1)
              expect(logger.result.mock.calls[0]).toEqual([errorResult])
            })
          })
        })
        describe('Given a category without a parent', () => {
          let categoryWithoutParent: Category
          beforeEach(() => {
            categoryWithoutParent = {
              id: 'the id',
              name: 'the name',
              slug: 'the slug',
              previousSlugs: ['the', 'previous', 'slugs'],
              path: '/the path',
              previousPaths: ['/previous 1', '/previous 2'],
              description: 'the description',
              shortDescription: 'the short description',
              parent: undefined, // Hasn't been loaded yet
              children: [],
              updated: new Date(),
            }
            fetchParent.mockReturnValueOnce(Promise.resolve(resultOk<CategoryUsecase | undefined>(undefined)))
          })
          describe('When everything succeeds', () => {
            test('Then it returns null', async () => {
              const service = new GraphService(factory, mapper, logger)
              const parent = service.resolvers().Category?.parent
              assertResolverFn(parent)
              const result = await parent(categoryWithoutParent, {}, {}, {} as GraphQLResolveInfo)
              expect(result).toBeNull()
              expect(logger.result.mock.calls).toHaveLength(0)
            })
          })
        })
      })
      describe('children', () => {
        describe('Given a category with children', () => {
          let categoryWithChildren: Category
          let fetchedChildren: CategoryUsecase[]
          let mappedChildren: Category[]
          beforeEach(() => {
            categoryWithChildren = {
              id: 'the id',
              name: 'the name',
              slug: 'the slug',
              previousSlugs: ['the', 'previous', 'slugs'],
              path: '/the path',
              previousPaths: ['/previous 1', '/previous 2'],
              description: 'the description',
              shortDescription: 'the short description',
              parent: undefined,
              children: [],
              updated: new Date(),
            }
            fetchedChildren = [
              {
                id: 'fetch id',
                name: 'fetch name',
                slug: 'fetch slug',
                previousSlugs: [],
                path: '/fetch path',
                previousPaths: [],
                shortDescription: 'fetch short description',
                children: [],
                updated: new Date(),
              },
              {
                id: 'fetch id 2',
                name: 'fetch name 2',
                slug: 'fetch slug 2',
                previousSlugs: [],
                path: '/fetch path 2',
                previousPaths: [],
                shortDescription: 'fetch short description 2',
                children: [],
                updated: new Date(),
              },
            ]
            listChildren.mockReturnValueOnce(Promise.resolve(resultsOk<CategoryUsecase>(fetchedChildren)))
            mappedChildren = [
              {
                id: 'mapped id',
                name: 'mapped name',
                slug: 'mapped slug',
                previousSlugs: [],
                path: '/mapped path',
                previousPaths: ['/mapped previous 1', '/mapped previous 2'],
                shortDescription: 'mapped short description',
                children: [],
                updated: new Date(),
              },
              {
                id: 'mapped id 2',
                name: 'mapped name 2',
                slug: 'mapped slug 2',
                previousSlugs: [],
                path: '/mapped path',
                previousPaths: ['/mapped previous 1', '/mapped previous 2'],
                shortDescription: 'mapped short description 2',
                children: [],
                updated: new Date(),
              },
            ]
            mapper.categoriesFromUsecase.mockReturnValueOnce(mappedChildren)
          })
          describe('When everything succeeds', () => {
            test('Then the mapped children are returned', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              const result = await children(categoryWithChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(result).toEqual(mappedChildren)
            })
            test('Then the listChildren interactor is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await children(categoryWithChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(listChildren.mock.calls).toHaveLength(1)
              expect(listChildren.mock.calls[0]).toEqual(['the id'])
            })
            test('Then the mapper is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await children(categoryWithChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(mapper.categoriesFromUsecase.mock.calls).toHaveLength(1)
              expect(mapper.categoriesFromUsecase.mock.calls[0]).toEqual([fetchedChildren])
            })
            test('Then the result is not logged', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await children(categoryWithChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(logger.result.mock.calls).toHaveLength(0)
            })
          })
          describe('When fetching children errors', () => {
            let errorResults: Results<CategoryUsecase>
            beforeEach(() => {
              errorResults = resultsError('fetching error')
              listChildren.mockReset()
              listChildren.mockReturnValueOnce(Promise.resolve(errorResults))
            })
            test('Then the error logged and thrown', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await expect(children(categoryWithChildren, {}, {}, {} as GraphQLResolveInfo)).rejects.toThrow(
                'fetching error',
              )
              expect(logger.result.mock.calls).toHaveLength(1)
              expect(logger.result.mock.calls[0]).toEqual([errorResults.firstErrorResult])
            })
          })
        })
        describe('Given a category without children', () => {
          let categoryWithoutChildren: Category
          beforeEach(() => {
            categoryWithoutChildren = {
              id: 'the id',
              name: 'the name',
              slug: 'the slug',
              previousSlugs: ['the', 'previous', 'slugs'],
              path: '/the path',
              previousPaths: ['/previous 1', '/previous 2'],
              description: 'the description',
              shortDescription: 'the short description',
              parent: undefined,
              children: [],
              updated: new Date(),
            }
            listChildren.mockReturnValueOnce(Promise.resolve(resultsOk<CategoryUsecase>([])))
            mapper.categoriesFromUsecase.mockReturnValueOnce([])
          })
          describe('When everything succeeds', () => {
            test('Then an empty array is returned', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              const result = await children(categoryWithoutChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(result).toEqual([])
            })
            test('Then the listChildren interactor is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await children(categoryWithoutChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(listChildren.mock.calls).toHaveLength(1)
              expect(listChildren.mock.calls[0]).toEqual(['the id'])
            })
            test('Then the mapper is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await children(categoryWithoutChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(mapper.categoriesFromUsecase.mock.calls).toHaveLength(1)
              expect(mapper.categoriesFromUsecase.mock.calls[0]).toEqual([[]])
            })
            test('Then the result is not logged', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await children(categoryWithoutChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(logger.result.mock.calls).toHaveLength(0)
            })
          })
        })
      })
    })
    describe('Query', () => {
      describe('categories', () => {
        describe('Given there are categories to list', () => {
          let fetchedCategories: CategoryUsecase[]
          let mappedCategories: Category[]
          beforeEach(() => {
            fetchedCategories = [
              {
                id: 'fetch id 1',
                name: 'fetch name 1',
                slug: 'fetch slug 1',
                previousSlugs: [],
                path: '/fetch path 1',
                previousPaths: [],
                shortDescription: 'fetch short description 1',
                children: [],
                updated: new Date(),
              },
              {
                id: 'fetch id 2',
                name: 'fetch name 2',
                slug: 'fetch slug 2',
                previousSlugs: [],
                path: '/fetch path 2',
                previousPaths: [],
                shortDescription: 'fetch short description 2',
                children: [],
                updated: new Date(),
              },
            ]
            listCategories.mockReturnValueOnce(Promise.resolve(resultsOk<CategoryUsecase>(fetchedCategories)))
            mappedCategories = [
              {
                id: 'mapped id 1',
                name: 'mapped name 1',
                slug: 'mapped slug 1',
                previousSlugs: [],
                path: '/mapped path 1',
                previousPaths: ['/mapped previous 1 1', '/mapped previous 2 1'],
                shortDescription: 'mapped short description 1',
                children: [],
                updated: new Date(),
              },
              {
                id: 'mapped id 2',
                name: 'mapped name 2',
                slug: 'mapped slug 2',
                previousSlugs: [],
                path: '/mapped path 2',
                previousPaths: ['/mapped previous 1 2', '/mapped previous 2 2'],
                shortDescription: 'mapped short description 2',
                children: [],
                updated: new Date(),
              },
            ]
            mapper.categoriesFromUsecase.mockReturnValueOnce(mappedCategories)
          })
          describe('When everything succeeds', () => {
            test('Then the mapped categories are returned', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              const result = await categories({}, {}, {}, {} as GraphQLResolveInfo)
              expect(result).toEqual(mappedCategories)
            })
            test('Then the list interactor is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              await categories({}, {}, {}, {} as GraphQLResolveInfo)
              expect(listCategories.mock.calls).toHaveLength(1)
              expect(listCategories.mock.calls[0]).toEqual([])
            })
            test('Then the mapper is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              await categories({}, {}, {}, {} as GraphQLResolveInfo)
              expect(mapper.categoriesFromUsecase.mock.calls).toHaveLength(1)
              expect(mapper.categoriesFromUsecase.mock.calls[0]).toEqual([fetchedCategories])
            })
            test('Then the result is not logged', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              await categories({}, {}, {}, {} as GraphQLResolveInfo)
              expect(logger.result.mock.calls).toHaveLength(0)
            })
          })
          describe('When listing the categories errors', () => {
            let errorResult: Results<CategoryUsecase>
            beforeEach(() => {
              errorResult = resultsError<CategoryUsecase>('listing error')
              listCategories.mockReset()
              listCategories.mockReturnValueOnce(Promise.resolve(errorResult))
            })
            test('Then the error logged and thrown', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              await expect(categories({}, {}, {}, {} as GraphQLResolveInfo)).rejects.toThrow('listing error')
              expect(logger.result.mock.calls).toHaveLength(1)
              expect(logger.result.mock.calls[0]).toEqual([errorResult.firstErrorResult])
            })
          })
        })
        describe('Given there are no categories to list', () => {
          beforeEach(() => {
            listCategories.mockReturnValueOnce(Promise.resolve(resultsOk<CategoryUsecase>([])))
            mapper.categoriesFromUsecase.mockReturnValueOnce([])
          })
          describe('When everything succeeds', () => {
            test('Then an empty array is returned', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              const result = await categories({}, {}, {}, {} as GraphQLResolveInfo)
              expect(result).toEqual([])
            })
            test('Then the list interactor is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              await categories({}, {}, {}, {} as GraphQLResolveInfo)
              expect(listCategories.mock.calls).toHaveLength(1)
              expect(listCategories.mock.calls[0]).toEqual([])
            })
            test('Then the mapper is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              await categories({}, {}, {}, {} as GraphQLResolveInfo)
              expect(mapper.categoriesFromUsecase.mock.calls).toHaveLength(1)
              expect(mapper.categoriesFromUsecase.mock.calls[0]).toEqual([[]])
            })
            test('Then the result is not logged', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              await categories({}, {}, {}, {} as GraphQLResolveInfo)
              expect(logger.result.mock.calls).toHaveLength(0)
            })
          })
        })
      })
      describe('updated', () => {
        describe('Given an updated request', () => {
          describe('When updated results are fetched that include categories and risks', () => {
            let fetchedUpdated: UpdatedUsecase[]
            let fetchedCategory: CategoryUsecase
            let fetchedRisk: RiskUsecase
            let mappedUpdated: (Category | Risk)[]
            let mappedCategory: Category
            let mappedRisk: Risk
            beforeEach(() => {
              fetchedCategory = {
                id: 'category id',
                name: 'category name',
                slug: 'category slug',
                previousSlugs: [],
                path: '/category path',
                previousPaths: [],
                shortDescription: 'category short description',
                children: [],
                updated: new Date(),
              }
              fetchedRisk = {
                id: 'risk id',
                name: 'risk name',
                shortDescription: 'risk short description',
                updated: new Date(),
                category: 'Health',
                impact: 'High',
                likelihood: 'High',
                type: 'Condition',
              }
              fetchedUpdated = [fetchedCategory, fetchedRisk]
              listUpdated.mockReturnValueOnce(Promise.resolve(resultsOk<UpdatedUsecase>(fetchedUpdated)))
              mappedCategory = {
                id: 'mapped category id',
                name: 'mapped category name',
                slug: 'mapped category slug',
                previousSlugs: [],
                path: '/mapped path 1',
                previousPaths: ['/mapped previous 1', '/mapped previous 2'],
                shortDescription: 'mapped category short description',
                children: [],
                updated: new Date(),
              }
              mappedRisk = {
                id: 'mapped risk id',
                name: 'mapped risk name',
                shortDescription: 'mapped risk short description',
                updated: new Date(),
                category: CategoryTopLevel.Health,
                impact: Impact.High,
                likelihood: Likelihood.High,
                type: RiskType.Condition,
              }
              mappedUpdated = [mappedCategory, mappedRisk]
              mapper.updatedFromUsecase.mockReturnValueOnce(resultsOk<Category | Risk>(mappedUpdated))
            })
            test('Then the mapped results are returned', async () => {
              const service = new GraphService(factory, mapper, logger)
              const updated = service.resolvers().Query?.updated
              assertResolverFn(updated)
              const result = await updated({}, {}, {}, {} as GraphQLResolveInfo)

              expect(result).toEqual(mappedUpdated)
              expect(listUpdated.mock.calls).toHaveLength(1)
              expect(listUpdated.mock.calls[0]).toEqual([{ count: 10 }])
              expect(mapper.updatedFromUsecase.mock.calls).toHaveLength(1)
              expect(mapper.updatedFromUsecase.mock.calls[0]).toEqual([fetchedUpdated])
            })
          })
          describe('When listing updated entities errors', () => {
            let errorResult: Results<UpdatedUsecase>
            beforeEach(() => {
              errorResult = resultsError<UpdatedUsecase>('listing error')
              listUpdated.mockReset()
              listUpdated.mockReturnValueOnce(Promise.resolve(errorResult))
            })
            test('Then the error logged and thrown', async () => {
              const service = new GraphService(factory, mapper, logger)
              const updated = service.resolvers().Query?.updated
              assertResolverFn(updated)
              await expect(updated({}, {}, {}, {} as GraphQLResolveInfo)).rejects.toThrow('listing error')
              expect(logger.result.mock.calls).toHaveLength(1)
              expect(logger.result.mock.calls[0]).toEqual([errorResult.firstErrorResult])
            })
          })
          describe('When mapping error', () => {
            let errorResult: Results<Category | Risk>
            beforeEach(() => {
              errorResult = resultsError<Category | Risk>('mapping error')
              mapper.updatedFromUsecase.mockReset()
              mapper.updatedFromUsecase.mockReturnValueOnce(errorResult)
              listUpdated.mockReturnValueOnce(Promise.resolve(resultsOk<UpdatedUsecase>([])))
            })
            test('Then the error logged and thrown', async () => {
              const service = new GraphService(factory, mapper, logger)
              const updated = service.resolvers().Query?.updated
              assertResolverFn(updated)
              await expect(updated({}, {}, {}, {} as GraphQLResolveInfo)).rejects.toThrow('mapping error')
              expect(logger.result.mock.calls).toHaveLength(1)
              expect(logger.result.mock.calls[0]).toEqual([errorResult.firstErrorResult])
            })
          })
        })
      })
    })
    describe('Updated', () => {
      describe('__resolveType', () => {
        describe('Given an object that is identified as a category', () => {
          beforeEach(() => {
            mapper.isUpdatedCategory.mockReturnValueOnce(true)
            mapper.isUpdatedRisk.mockReturnValueOnce(false)
          })
          afterEach(() => {
            mapper.isUpdatedCategory.mockReset()
            mapper.isUpdatedRisk.mockReset()
          })
          test("Then it returns 'Risk'", () => {
            const service = new GraphService(factory, mapper, logger)
            const obj = {} as Category
            expect(service.resolvers().Updated?.__resolveType(obj, undefined, {} as GraphQLResolveInfo)).toBe(
              'Category',
            )
            expect(mapper.isUpdatedCategory.mock.calls).toHaveLength(1)
            expect(mapper.isUpdatedCategory.mock.calls[0]).toEqual([obj])
            expect(mapper.isUpdatedCategory.mock.calls[0][0]).toBe(obj)
          })
        })
        describe('Given an object that is identified as a risk', () => {
          beforeEach(() => {
            mapper.isUpdatedCategory.mockReturnValueOnce(false)
            mapper.isUpdatedRisk.mockReturnValueOnce(true)
          })
          afterEach(() => {
            mapper.isUpdatedCategory.mockReset()
            mapper.isUpdatedRisk.mockReset()
          })
          test("Then it returns 'Risk'", () => {
            const service = new GraphService(factory, mapper, logger)
            const obj = {} as Risk
            expect(service.resolvers().Updated?.__resolveType(obj, undefined, {} as GraphQLResolveInfo)).toBe('Risk')
            expect(mapper.isUpdatedRisk.mock.calls).toHaveLength(1)
            expect(mapper.isUpdatedRisk.mock.calls[0]).toEqual([obj])
            expect(mapper.isUpdatedRisk.mock.calls[0][0]).toBe(obj)
          })
        })
        describe('Given an object of unknown type', () => {
          beforeEach(() => {
            mapper.isUpdatedCategory.mockReturnValueOnce(false)
            mapper.isUpdatedRisk.mockReturnValueOnce(false)
          })
          afterEach(() => {
            mapper.isUpdatedCategory.mockReset()
            mapper.isUpdatedRisk.mockReset()
          })
          test('Then it returns null', () => {
            const service = new GraphService(factory, mapper, logger)
            const obj = {} as unknown
            // @ts-expect-error Testing the case of an unexpected type
            expect(service.resolvers().Updated?.__resolveType(obj, undefined, {} as GraphQLResolveInfo)).toBeNull()
            expect(mapper.isUpdatedRisk.mock.calls).toHaveLength(1)
            expect(mapper.isUpdatedRisk.mock.calls[0]).toEqual([obj])
            expect(mapper.isUpdatedRisk.mock.calls[0][0]).toBe(obj)
            expect(mapper.isUpdatedCategory.mock.calls).toHaveLength(1)
            expect(mapper.isUpdatedCategory.mock.calls[0]).toEqual([obj])
            expect(mapper.isUpdatedCategory.mock.calls[0][0]).toBe(obj)
          })
        })
      })
    })
    describe('Date', () => {
      describe('Given a Date to serialize', () => {
        describe("When it's a valid", () => {
          test('Then it returns the expected ISO 8601 string', () => {
            const service = new GraphService(factory, mapper, logger)
            const date = new Date('2022-01-20T10:41:00+0000')
            expect(service.resolvers().Date?.serialize(date)).toBe('2022-01-20T10:41:00.000Z')
          })
        })
      })
      describe('Given an ISO 8601 string to parse', () => {
        describe("When it's valid", () => {
          test('Then it returns the expected Date', () => {
            const service = new GraphService(factory, mapper, logger)
            const date = new Date('2022-01-20T10:41:00+0000')
            expect(service.resolvers().Date?.parseValue('2022-01-20T10:41:00.000Z')).toEqual(date)
          })
        })
      })
      describe('Given an ast value', () => {
        describe("When it's a string", () => {
          test('Then it returns the expected Date', () => {
            const service = new GraphService(factory, mapper, logger)
            const date = new Date('2022-01-20T10:41:00+0000')
            expect(
              service
                .resolvers()
                .Date?.parseLiteral({ kind: Kind.STRING, value: '2022-01-20T10:41:00.000Z' } as ValueNode, {}),
            ).toEqual(date)
          })
        })
        describe("When it's not a string", () => {
          test('Then it returns null', () => {
            const service = new GraphService(factory, mapper, logger)
            expect(
              service
                .resolvers()
                .Date?.parseLiteral({ kind: Kind.INT, value: '2022-01-20T10:41:00.000Z' } as ValueNode, {}),
            ).toBeNull()
          })
        })
      })
    })
  })
})
