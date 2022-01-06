import { Category as CategoryUsecase } from '@life/usecase/mapper'
import { Resolver, ResolverFn, Category } from '@life/__generated__/graphql'
import { Logger } from '@util/logger'
import { Result, resultError, resultOk, Results, resultsError, resultsOk } from '@util/result'
import { GraphQLResolveInfo } from 'graphql'
import { GraphMapper } from './mapper'

import { GraphService, InteractorFactory } from './service'
import { mockDeep, MockedDeep } from '@util/mock'
import { FetchParentInteractor } from '@life/usecase/category/fetchParent'
import { FetchChildrenInteractor } from '@life/usecase/category/fetchChildren'
import { ListInteractor } from '@life/usecase/category/list'

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
    let fetchChildren: jest.MockedFunction<FetchChildrenInteractor['fetchChildren']>
    let list: jest.MockedFunction<ListInteractor['list']>
    beforeEach(() => {
      factory = mockDeep<InteractorFactory>()
      fetchParent = jest.fn()
      factory.category.fetchParentInteractor.mockReturnValue({
        fetchParent,
      })
      fetchChildren = jest.fn()
      factory.category.fetchChildrenInteractor.mockReturnValue({
        fetchChildren,
      })
      list = jest.fn()
      factory.category.listInteractor.mockReturnValue({
        list,
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
              path: 'the path',
              description: 'the description',
              shortDescription: 'the short description',
              parent: undefined, // Hasn't been loaded yet
              children: [],
              updated: new Date(),
            }
            fetchedParent = {
              id: 'fetch id',
              name: 'fetch name',
              path: 'fetch path',
              shortDescription: 'fetch short description',
              children: [],
              updated: new Date(),
            }
            fetchParent.mockReturnValueOnce(Promise.resolve(resultOk<CategoryUsecase>(fetchedParent)))
            mappedParent = {
              id: 'mapped id',
              name: 'mapped name',
              path: 'mapped path',
              shortDescription: 'mapped short description',
              children: [],
              updated: new Date(),
            }
            mapper.categoryFromUsecase.mockReturnValueOnce(resultOk<Category>(mappedParent))
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
          describe('When mapping the parent errors', () => {
            let errorResult: Result<Category>
            beforeEach(() => {
              errorResult = resultError<Category>('mapping error')
              mapper.categoryFromUsecase.mockReset()
              mapper.categoryFromUsecase.mockReturnValueOnce(errorResult)
            })
            test('Then the error logged and thrown', async () => {
              const service = new GraphService(factory, mapper, logger)
              const parent = service.resolvers().Category?.parent
              assertResolverFn(parent)
              await expect(parent(categoryWithParent, {}, {}, {} as GraphQLResolveInfo)).rejects.toThrow(
                'mapping error',
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
              path: 'the path',
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
              path: 'the path',
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
                path: 'fetch path',
                shortDescription: 'fetch short description',
                children: [],
                updated: new Date(),
              },
              {
                id: 'fetch id 2',
                name: 'fetch name 2',
                path: 'fetch path 2',
                shortDescription: 'fetch short description 2',
                children: [],
                updated: new Date(),
              },
            ]
            fetchChildren.mockReturnValueOnce(Promise.resolve(resultsOk<CategoryUsecase>(fetchedChildren)))
            mappedChildren = [
              {
                id: 'mapped id',
                name: 'mapped name',
                path: 'mapped path',
                shortDescription: 'mapped short description',
                children: [],
                updated: new Date(),
              },
              {
                id: 'mapped id 2',
                name: 'mapped name 2',
                path: 'mapped path 2',
                shortDescription: 'mapped short description 2',
                children: [],
                updated: new Date(),
              },
            ]
            mapper.categoriesFromUsecase.mockReturnValueOnce(resultsOk<Category>(mappedChildren))
          })
          describe('When everything succeeds', () => {
            test('Then the mapped children are returned', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              const result = await children(categoryWithChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(result).toEqual(mappedChildren)
            })
            test('Then the fetchChildren interactor is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await children(categoryWithChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(fetchChildren.mock.calls).toHaveLength(1)
              expect(fetchChildren.mock.calls[0]).toEqual(['the id'])
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
              fetchChildren.mockReset()
              fetchChildren.mockReturnValueOnce(Promise.resolve(errorResults))
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
          describe('When mapping a child errors', () => {
            let errorResults: Results<Category>
            beforeEach(() => {
              errorResults = resultsError('mapping error')
              mapper.categoriesFromUsecase.mockReset()
              mapper.categoriesFromUsecase.mockReturnValueOnce(errorResults)
            })
            test('Then the error logged and thrown', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await expect(children(categoryWithChildren, {}, {}, {} as GraphQLResolveInfo)).rejects.toThrow(
                'mapping error',
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
              path: 'the path',
              description: 'the description',
              shortDescription: 'the short description',
              parent: undefined,
              children: [],
              updated: new Date(),
            }
            fetchChildren.mockReturnValueOnce(Promise.resolve(resultsOk<CategoryUsecase>([])))
            mapper.categoriesFromUsecase.mockReturnValueOnce(resultsOk<Category>([]))
          })
          describe('When everything succeeds', () => {
            test('Then an empty array is returned', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              const result = await children(categoryWithoutChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(result).toEqual([])
            })
            test('Then the fetchChildren interactor is called', async () => {
              const service = new GraphService(factory, mapper, logger)
              const children = service.resolvers().Category?.children
              assertResolverFn(children)
              await children(categoryWithoutChildren, {}, {}, {} as GraphQLResolveInfo)
              expect(fetchChildren.mock.calls).toHaveLength(1)
              expect(fetchChildren.mock.calls[0]).toEqual(['the id'])
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
      describe('updated', () => {
        // TODO:
      })

      describe('categories', () => {
        describe('Given there are categories to list', () => {
          let fetchedCategories: CategoryUsecase[]
          let mappedCategories: Category[]
          beforeEach(() => {
            fetchedCategories = [
              {
                id: 'fetch id 1',
                name: 'fetch name 1',
                path: 'fetch path 1',
                shortDescription: 'fetch short description 1',
                children: [],
                updated: new Date(),
              },
              {
                id: 'fetch id 2',
                name: 'fetch name 2',
                path: 'fetch path 2',
                shortDescription: 'fetch short description 2',
                children: [],
                updated: new Date(),
              },
            ]
            list.mockReturnValueOnce(Promise.resolve(resultsOk<CategoryUsecase>(fetchedCategories)))
            mappedCategories = [
              {
                id: 'mapped id 1',
                name: 'mapped name 1',
                path: 'mapped path 1',
                shortDescription: 'mapped short description 1',
                children: [],
                updated: new Date(),
              },
              {
                id: 'mapped id 2',
                name: 'mapped name 2',
                path: 'mapped path 2',
                shortDescription: 'mapped short description 2',
                children: [],
                updated: new Date(),
              },
            ]
            mapper.categoriesFromUsecase.mockReturnValueOnce(resultsOk<Category>(mappedCategories))
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
              expect(list.mock.calls).toHaveLength(1)
              expect(list.mock.calls[0]).toEqual([])
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
              list.mockReset()
              list.mockReturnValueOnce(Promise.resolve(errorResult))
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
          describe('When mapping a category errors', () => {
            let errorResult: Results<Category>
            beforeEach(() => {
              errorResult = resultsError<Category>('mapping error')
              mapper.categoriesFromUsecase.mockReset()
              mapper.categoriesFromUsecase.mockReturnValueOnce(errorResult)
            })
            test('Then the error logged and thrown', async () => {
              const service = new GraphService(factory, mapper, logger)
              const categories = service.resolvers().Query?.categories
              assertResolverFn(categories)
              await expect(categories({}, {}, {}, {} as GraphQLResolveInfo)).rejects.toThrow('mapping error')
              expect(logger.result.mock.calls).toHaveLength(1)
              expect(logger.result.mock.calls[0]).toEqual([errorResult.firstErrorResult])
            })
          })
        })
        describe('Given there are no categories to list', () => {
          beforeEach(() => {
            list.mockReturnValueOnce(Promise.resolve(resultsOk<CategoryUsecase>([])))
            mapper.categoriesFromUsecase.mockReturnValueOnce(resultsOk<Category>([]))
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
              expect(list.mock.calls).toHaveLength(1)
              expect(list.mock.calls[0]).toEqual([])
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
    })
  })
})
