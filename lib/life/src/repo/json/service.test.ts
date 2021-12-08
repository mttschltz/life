import { Result, resultError, resultOk } from '@util/result'
import { CategoryMapper } from '@life/repo/json/mapper'
import { Category } from '@life/category'
import { CategoryRepoJson } from './service'
import { assertResultError, assertResultOk } from '@util/testing'
import { mockDeep, Mocked } from '@util/mock'
import { CategoryRepo } from '@life/repo'

describe('CategoryRepoJson', () => {
  describe('fetchCategory', () => {
    describe('Given a fetched category with no parent or children', () => {
      describe('When everything succeeds', () => {
        test('Then the mapped result is returned', async () => {
          const mapped: Category = {
            id: 'mapped id',
            name: 'mapped name',
            path: 'mapped path',
            children: [],
          }
          const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest
            .fn()
            .mockReturnValueOnce(resultOk(mapped))
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const repo = new CategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  children: [],
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetchCategory('id')
          assertResultOk(result)
          expect(result.value).toBe(mapped)
          expect(fromJson.mock.calls).toHaveLength(1)
          expect(fromJson.mock.calls[0]).toEqual([
            {
              id: 'id',
              name: 'name',
              path: 'path',
              children: [],
            },
            undefined,
            [],
          ])
        })
      })
      describe('When the cateegory is not found', () => {
        test('Then an error result is returned', async () => {
          const mapper: CategoryMapper = {
            fromJson: jest.fn(),
            toJson: jest.fn(),
          }

          const repo = new CategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  children: [],
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetchCategory('missing id')
          assertResultError(result)
          expect(result.message).toBe("Could not find category 'missing id'")
        })
      })
      describe('When the mapping errors', () => {
        test('Then the mapped error result is returned', async () => {
          const mapperErrorResult = resultError('error')
          const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest
            .fn()
            .mockReturnValueOnce(mapperErrorResult)
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const repo = new CategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  children: [],
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetchCategory('id')
          assertResultError(result)
          expect(result).toBe(mapperErrorResult)
        })
      })
    })
    describe('Given a fetched category with a parent and children', () => {
      describe('When everything succeeds', () => {
        test('Then the mapped result is returned', async () => {
          const categoryMapped: Category = {
            id: 'mapped id',
            name: 'mapped name',
            path: 'mapped path',
            children: [],
          }
          const parentMapped: Category = {
            id: 'parent mapped id',
            name: 'parent mapped name',
            path: 'parent mapped path',
            children: [],
          }
          const child1Mapped: Category = {
            id: 'child1 mapped id',
            name: 'child1 mapped name',
            path: 'child1 mapped path',
            children: [],
          }
          const child2Mapped: Category = {
            id: 'child2 mapped id',
            name: 'child2 mapped name',
            path: 'child2 mapped path',
            children: [],
          }
          const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest.fn().mockImplementation(({ id }) => {
            switch (id) {
              case 'id':
                return resultOk(categoryMapped)
              case 'parent id':
                return resultOk(parentMapped)
              case 'child1 id':
                return resultOk(child1Mapped)
              case 'child2 id':
                return resultOk(child2Mapped)
              default:
                resultError('error')
            }
          })
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const categoryRepo = {
            id: 'id',
            name: 'name',
            path: 'path',
            parentId: 'parent id',
            children: ['child1 id', 'child2 id'],
          }
          const parentRepo = {
            id: 'parent id',
            name: 'parent name',
            path: 'parent path',
            children: ['id'],
          }
          const child1Repo = {
            id: 'child1 id',
            name: 'child1 name',
            path: 'child1 path',
            parentId: 'id',
            children: [],
          }
          const child2Repo = {
            id: 'child2 id',
            name: 'child2 name',
            path: 'child2 path',
            parentId: 'id',
            children: [],
          }
          const repo = new CategoryRepoJson(
            {
              category: {
                id: categoryRepo,
                'parent id': parentRepo,
                'child1 id': child1Repo,
                'child2 id': child2Repo,
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetchCategory('id')
          assertResultOk(result)
          expect(result.value).toBe(categoryMapped)
          expect(fromJson.mock.calls).toHaveLength(4)
          expect(fromJson.mock.calls[0]).toEqual([parentRepo, undefined, []])
          expect(fromJson.mock.calls[1]).toEqual([child1Repo, undefined, []])
          expect(fromJson.mock.calls[2]).toEqual([child2Repo, undefined, []])
          expect(fromJson.mock.calls[3]).toEqual([categoryRepo, parentMapped, [child1Mapped, child2Mapped]])
        })
      })
      describe('When the parent is not found', () => {
        test('Then an error result is returned', async () => {
          const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest.fn()
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const repo = new CategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  parentId: 'parent id',
                  children: ['child1 id', 'child2 id'],
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetchCategory('id')
          assertResultError(result)
          expect(result.message).toBe("Could not find parent category 'parent id'")
        })
      })
      describe('When a child is not found', () => {
        test('Then an error result is returned', async () => {
          const parentMapped: Category = {
            id: 'parent mapped id',
            name: 'parent mapped name',
            path: 'parent mapped path',
            children: [],
          }
          const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest
            .fn()
            .mockReturnValueOnce(resultOk(parentMapped))
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const repo = new CategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  parentId: 'parent id',
                  children: ['child1 id', 'child2 id'],
                },
                'parent id': {
                  id: 'parent id',
                  name: 'parent name',
                  path: 'parent path',
                  children: ['id'],
                },
                'child1 id': {
                  id: 'child1 id',
                  name: 'child1 name',
                  path: 'child1 path',
                  parentId: 'id',
                  children: [],
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetchCategory('id')
          assertResultError(result)
          expect(result.message).toBe("Could not find child category 'child2 id'")
        })
      })
    })
  })
  describe('fetchParent', () => {
    describe('Given a child ID that has a parent', () => {
      describe('When everything succeeds', () => {
        let mapper: Mocked<CategoryMapper>
        let repo: CategoryRepo
        let fetchCategory: jest.SpyInstance<Promise<Result<Category>>, [id: string]>
        let fetchedCategoryResult: Result<Category>
        beforeEach(() => {
          mapper = mockDeep<CategoryMapper>()
          repo = new CategoryRepoJson(
            {
              category: {
                'parent id': {
                  id: 'parent id',
                  name: 'parent name',
                  path: 'parent path',
                  children: ['child id'],
                },
                'child id': {
                  id: 'child id',
                  name: 'child name',
                  path: 'child path',
                  parentId: 'parent id',
                  children: [],
                },
              },
              risk: {},
            },
            mapper,
          )
          fetchedCategoryResult = resultOk({
            id: 'fetched id',
            name: 'fetched name',
            path: 'fetched path',
            children: [],
          })
          fetchCategory = jest
            .spyOn(repo, 'fetchCategory')
            .mockImplementation(async () => Promise.resolve(fetchedCategoryResult))
        })
        test('Then fetchCategory is called and its value returned', async () => {
          const result = await repo.fetchParent('child id')
          assertResultOk(result)
          expect(fetchCategory.mock.calls).toHaveLength(1)
          expect(fetchCategory.mock.calls[0]).toEqual(['parent id'])
          expect(result).toBe(fetchedCategoryResult)
        })
      })
      describe('When fetchCategory returns an error result', () => {
        let mapper: Mocked<CategoryMapper>
        let repo: CategoryRepo
        let fetchCategory: jest.SpyInstance<Promise<Result<Category>>, [id: string]>
        let fetchedCategoryResult: Result<Category>
        beforeEach(() => {
          mapper = mockDeep<CategoryMapper>()
          repo = new CategoryRepoJson(
            {
              category: {
                'parent id': {
                  id: 'parent id',
                  name: 'parent name',
                  path: 'parent path',
                  children: ['child id'],
                },
                'child id': {
                  id: 'child id',
                  name: 'child name',
                  path: 'child path',
                  parentId: 'parent id',
                  children: [],
                },
              },
              risk: {},
            },
            mapper,
          )
          fetchedCategoryResult = resultError('fetchCategory error')
          fetchCategory = jest
            .spyOn(repo, 'fetchCategory')
            .mockImplementation(async () => Promise.resolve(fetchedCategoryResult))
        })
        test('Then that error result is returned', async () => {
          const result = await repo.fetchParent('child id')
          assertResultError(result)
          expect(fetchCategory.mock.calls).toHaveLength(1)
          expect(fetchCategory.mock.calls[0]).toEqual(['parent id'])
          expect(result).toEqual(fetchedCategoryResult)
        })
      })
      describe('When the child is not in the repo', () => {
        let mapper: Mocked<CategoryMapper>
        let repo: CategoryRepo
        let fetchCategory: jest.SpyInstance<Promise<Result<Category>>, [id: string]>
        let fetchedCategoryResult: Result<Category>
        beforeEach(() => {
          mapper = mockDeep<CategoryMapper>()
          repo = new CategoryRepoJson(
            {
              category: {
                'child id': {
                  id: 'child id',
                  name: 'child name',
                  path: 'child path',
                  parentId: 'parent id',
                  children: [],
                },
              },
              risk: {},
            },
            mapper,
          )
          fetchedCategoryResult = resultError('fetchCategory error')
          fetchCategory = jest
            .spyOn(repo, 'fetchCategory')
            .mockImplementation(async () => Promise.resolve(fetchedCategoryResult))
        })
        test('Then an error result is returned', async () => {
          const result = await repo.fetchParent('non existent child id')
          assertResultError(result)
          expect(result.message).toEqual(`Could not find category 'non existent child id'`)
        })
        test('Then fetchCategory is not called', async () => {
          const result = await repo.fetchParent('non existent child id')
          assertResultError(result)
          expect(result.message).toEqual(`Could not find category 'non existent child id'`)
          expect(fetchCategory.mock.calls).toHaveLength(0)
        })
      })
    })
    describe('Given a child ID that has no parent', () => {
      describe('When everything succeeds', () => {
        let mapper: Mocked<CategoryMapper>
        let repo: CategoryRepo
        let fetchCategory: jest.SpyInstance<Promise<Result<Category>>, [id: string]>
        let fetchedCategoryResult: Result<Category>
        beforeEach(() => {
          mapper = mockDeep<CategoryMapper>()
          repo = new CategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  children: [],
                },
              },
              risk: {},
            },
            mapper,
          )
          fetchCategory = jest
            .spyOn(repo, 'fetchCategory')
            .mockImplementation(async () => Promise.resolve(fetchedCategoryResult))
        })
        test('Then undefined is returned', async () => {
          const result = await repo.fetchParent('id')
          assertResultOk(result)
          expect(result.value).toBeUndefined()
        })
        test('Then fetchCategory is not called', async () => {
          const result = await repo.fetchParent('id')
          assertResultOk(result)
          expect(fetchCategory.mock.calls).toHaveLength(0)
        })
      })
    })
  })

  describe('listCategories', () => {
    describe('Given a request', () => {
      describe('When everything succeeds', () => {
        test('Then the root mapped categories are returned', async () => {
          const root1Mapped: Category = {
            id: 'root1 mapped id',
            name: 'root1 mapped name',
            path: 'root1 mapped path',
            children: [],
          }
          const child1Mapped: Category = {
            id: 'child1 mapped id',
            name: 'child1 mapped name',
            path: 'child1 mapped path',
            children: [],
          }
          const root2Mapped: Category = {
            id: 'root2 mapped id',
            name: 'root2 mapped name',
            path: 'root2 mapped path',
            children: [],
          }
          const child2Mapped: Category = {
            id: 'child2 mapped id',
            name: 'child2 mapped name',
            path: 'child2 mapped path',
            children: [],
          }
          const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest.fn().mockImplementation(({ id }) => {
            switch (id) {
              case 'root1 id':
                return resultOk(root1Mapped)
              case 'child1 id':
                return resultOk(child1Mapped)
              case 'root2 id':
                return resultOk(root2Mapped)
              case 'child2 id':
                return resultOk(child2Mapped)
              default:
                resultError('error')
            }
          })
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const root1Repo = {
            id: 'root1 id',
            name: 'root1 name',
            path: 'root1 path',
            children: ['child1 id'],
          }
          const category1Repo = {
            id: 'child1 id',
            name: 'child1 name',
            path: 'child1 path',
            parentId: 'root1 id',
            children: [],
          }
          const root2Repo = {
            id: 'root2 id',
            name: 'root2 name',
            path: 'root2 path',
            children: ['child2 id'],
          }
          const child2Repo = {
            id: 'child2 id',
            name: 'child2 name',
            path: 'child2 path',
            parentId: 'child1 id',
            children: [],
          }
          const repo = new CategoryRepoJson(
            {
              category: {
                'root1 id': root1Repo,
                'child1 id': category1Repo,
                'root2 id': root2Repo,
                'child2 id': child2Repo,
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.listCategories()
          expect(result.firstErrorResult).toBeUndefined()
          const categories = result.okValues
          expect(categories).toHaveLength(2)
          expect(categories[0]).toEqual(root1Mapped)
          expect(categories[1]).toEqual(root2Mapped)
          expect(fromJson.mock.calls).toHaveLength(4)
          expect(fromJson.mock.calls[0]).toEqual([category1Repo, undefined, []])
          expect(fromJson.mock.calls[1]).toEqual([root1Repo, undefined, [child1Mapped]])
          expect(fromJson.mock.calls[2]).toEqual([child2Repo, undefined, []])
          expect(fromJson.mock.calls[3]).toEqual([root2Repo, undefined, [child2Mapped]])
        })
      })
      describe('When fetching a category errors', () => {
        test('Then the same error result is returned', async () => {
          const mapperError = resultError('error')
          const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest.fn().mockReturnValueOnce(mapperError)
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const root1Repo = {
            id: 'root1 id',
            name: 'root1 name',
            path: 'root1 path',
            children: ['child1 id'],
          }
          const category1Repo = {
            id: 'child1 id',
            name: 'child1 name',
            path: 'child1 path',
            parentId: 'root1 id',
            children: [],
          }
          const repo = new CategoryRepoJson(
            {
              category: {
                'root1 id': root1Repo,
                'child1 id': category1Repo,
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.listCategories()
          expect(result.firstErrorResult).toBe(mapperError)
          expect(result.okValues).toEqual([])
          expect(result.values).toEqual([undefined])
        })
      })
    })
  })
})
