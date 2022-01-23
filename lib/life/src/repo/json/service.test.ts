import { Result, resultError, resultOk } from '@helper/result'
import { CategoryJson, CategoryMapper } from '@life/repo/json/mapper'
import { Category } from '@life/category'
import { assertResultError, assertResultOk } from '@helper/testing'
import { mockDeep, Mocked } from '@helper/mock'
import { CategoryRepo } from '@life/repo'
import { newCategoryRepoJson } from './category'

describe('CategoryRepoJson', () => {
  describe('repo>category>fetch', () => {
    describe('Given a fetched category with no parent or children', () => {
      describe('When everything succeeds', () => {
        test('Then the mapped result is returned', async () => {
          const mapped: Category = {
            id: 'mapped id',
            name: 'mapped name',
            path: 'mapped path',
            shortDescription: 'mapped short description',
            children: [],
            updated: new Date(),
          }
          const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest
            .fn()
            .mockReturnValueOnce(resultOk(mapped))
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const repoUpdated = new Date('2022-01-01')
          const repo = newCategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  shortDescription: 'short description',
                  children: [],
                  updated: repoUpdated,
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetch('id')
          assertResultOk(result)
          expect(result.value).toBe(mapped)
          expect(fromJson.mock.calls).toHaveLength(1)
          expect(fromJson.mock.calls[0]).toEqual([
            {
              id: 'id',
              name: 'name',
              path: 'path',
              shortDescription: 'short description',
              children: [],
              updated: repoUpdated,
            },
            undefined,
            [],
          ] as Parameters<typeof fromJson>)
        })
      })
      describe('When the category is not found', () => {
        test('Then an error result is returned', async () => {
          const mapper: CategoryMapper = {
            fromJson: jest.fn(),
            toJson: jest.fn(),
          }

          const repo = newCategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  shortDescription: 'short description',
                  children: [],
                  updated: new Date(),
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetch('missing id')
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

          const repo = newCategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  shortDescription: 'short description',
                  children: [],
                  updated: new Date(),
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetch('id')
          assertResultError(result)
          expect(result).toBe(mapperErrorResult)
        })
      })
      describe('When mapping the parent errors', () => {
        test('Then the mapped error result is returned', async () => {
          const mapped: Category = {
            id: 'mapped id',
            name: 'mapped name',
            path: 'mapped path',
            shortDescription: 'mapped short description',
            children: [],
            updated: new Date(),
          }
          const mapperErrorResult = resultError<Category>('parent mapping error')
          const fromJson = (jest.fn() as jest.MockedFunction<CategoryMapper['fromJson']>).mockImplementationOnce(
            (json) => {
              if (json.id === 'parent id') {
                return mapperErrorResult
              }
              if (json.id === 'id') {
                return resultOk(mapped)
              }
              throw new Error('unexpected call')
            },
          )
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const repo = newCategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  shortDescription: 'short description',
                  children: [],
                  updated: new Date(),
                  parentId: 'parent id',
                },
                'parent id': {
                  id: 'parent id',
                  name: 'parent name',
                  path: 'parent path',
                  shortDescription: 'parent short description',
                  children: [],
                  updated: new Date(),
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetch('id')
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
            shortDescription: 'mapped short description',
            children: [],
            updated: new Date(),
          }
          const parentMapped: Category = {
            id: 'parent mapped id',
            name: 'parent mapped name',
            path: 'parent mapped path',
            shortDescription: 'parent mapped short description',
            children: [],
            updated: new Date(),
          }
          const child1Mapped: Category = {
            id: 'child1 mapped id',
            name: 'child1 mapped name',
            path: 'child1 mapped path',
            shortDescription: 'child1 mapped short description',
            children: [],
            updated: new Date(),
          }
          const child2Mapped: Category = {
            id: 'child2 mapped id',
            name: 'child2 mapped name',
            path: 'child2 mapped path',
            shortDescription: 'child2 mapped short description',
            children: [],
            updated: new Date(),
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

          const categoryRepo: CategoryJson = {
            id: 'id',
            name: 'name',
            path: 'path',
            parentId: 'parent id',
            shortDescription: 'short description',
            children: ['child1 id', 'child2 id'],
            updated: new Date(),
          }
          const parentRepo: CategoryJson = {
            id: 'parent id',
            name: 'parent name',
            path: 'parent path',
            shortDescription: 'parent short description',
            children: ['id'],
            updated: new Date(),
          }
          const child1Repo: CategoryJson = {
            id: 'child1 id',
            name: 'child1 name',
            path: 'child1 path',
            shortDescription: 'child1 short description',
            parentId: 'id',
            children: [],
            updated: new Date(),
          }
          const child2Repo: CategoryJson = {
            id: 'child2 id',
            name: 'child2 name',
            path: 'child2 path',
            shortDescription: 'child2 short description',
            parentId: 'id',
            children: [],
            updated: new Date(),
          }
          const repo = newCategoryRepoJson(
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

          const result = await repo.fetch('id')
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

          const repo = newCategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  shortDescription: 'short description',
                  parentId: 'parent id',
                  children: ['child1 id', 'child2 id'],
                  updated: new Date(),
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetch('id')
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
            shortDescription: 'parent mapped short description',
            children: [],
            updated: new Date(),
          }
          const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest
            .fn()
            .mockReturnValueOnce(resultOk(parentMapped))
          const mapper: CategoryMapper = {
            fromJson,
            toJson: jest.fn(),
          }

          const repo = newCategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  shortDescription: 'short description',
                  parentId: 'parent id',
                  children: ['child1 id', 'child2 id'],
                  updated: new Date(),
                },
                'parent id': {
                  id: 'parent id',
                  name: 'parent name',
                  path: 'parent path',
                  shortDescription: 'parent short description',
                  children: ['id'],
                  updated: new Date(),
                },
                'child1 id': {
                  id: 'child1 id',
                  name: 'child1 name',
                  path: 'child1 path',
                  shortDescription: 'child1 short description',
                  parentId: 'id',
                  children: [],
                  updated: new Date(),
                },
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.fetch('id')
          assertResultError(result)
          expect(result.message).toBe("Could not find child category 'child2 id'")
        })
      })
    })
  })
  describe('repo>category>fetchParent', () => {
    describe('Given a child ID that has a parent', () => {
      describe('When everything succeeds', () => {
        let mapper: Mocked<CategoryMapper>
        let repo: CategoryRepo
        let fetchCategory: jest.SpyInstance<Promise<Result<Category>>, [id: string]>
        let fetchedCategoryResult: Result<Category>
        beforeEach(() => {
          mapper = mockDeep<CategoryMapper>()
          repo = newCategoryRepoJson(
            {
              category: {
                'parent id': {
                  id: 'parent id',
                  name: 'parent name',
                  path: 'parent path',
                  shortDescription: 'parent short description',
                  children: ['child id'],
                  updated: new Date(),
                },
                'child id': {
                  id: 'child id',
                  name: 'child name',
                  path: 'child path',
                  shortDescription: 'child1 short description',
                  parentId: 'parent id',
                  children: [],
                  updated: new Date(),
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
            shortDescription: 'fetched short description',
            children: [],
            updated: new Date(),
          })
          fetchCategory = jest
            .spyOn(repo, 'fetch')
            .mockImplementation(async () => Promise.resolve(fetchedCategoryResult))
        })
        test('Then fetch is called and its value returned', async () => {
          const result = await repo.fetchParent('child id')
          assertResultOk(result)
          expect(fetchCategory.mock.calls).toHaveLength(1)
          expect(fetchCategory.mock.calls[0]).toEqual(['parent id'])
          expect(result).toBe(fetchedCategoryResult)
        })
      })
      describe('When fetch returns an error result', () => {
        let mapper: Mocked<CategoryMapper>
        let repo: CategoryRepo
        let fetchCategory: jest.SpyInstance<Promise<Result<Category>>, [id: string]>
        let fetchedCategoryResult: Result<Category>
        beforeEach(() => {
          mapper = mockDeep<CategoryMapper>()
          repo = newCategoryRepoJson(
            {
              category: {
                'parent id': {
                  id: 'parent id',
                  name: 'parent name',
                  path: 'parent path',
                  shortDescription: 'parent short description',
                  children: ['child id'],
                  updated: new Date(),
                },
                'child id': {
                  id: 'child id',
                  name: 'child name',
                  path: 'child path',
                  shortDescription: 'child short description',
                  parentId: 'parent id',
                  children: [],
                  updated: new Date(),
                },
              },
              risk: {},
            },
            mapper,
          )
          fetchedCategoryResult = resultError('fetch error')
          fetchCategory = jest
            .spyOn(repo, 'fetch')
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
          repo = newCategoryRepoJson(
            {
              category: {
                'child id': {
                  id: 'child id',
                  name: 'child name',
                  path: 'child path',
                  parentId: 'parent id',
                  shortDescription: 'child short description',
                  children: [],
                  updated: new Date(),
                },
              },
              risk: {},
            },
            mapper,
          )
          fetchedCategoryResult = resultError('fetch error')
          fetchCategory = jest
            .spyOn(repo, 'fetch')
            .mockImplementation(async () => Promise.resolve(fetchedCategoryResult))
        })
        test('Then an error result is returned', async () => {
          const result = await repo.fetchParent('non existent child id')
          assertResultError(result)
          expect(result.message).toBe(`Could not find category 'non existent child id'`)
        })
        test('Then fetch is not called', async () => {
          const result = await repo.fetchParent('non existent child id')
          assertResultError(result)
          expect(result.message).toBe(`Could not find category 'non existent child id'`)
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
          repo = newCategoryRepoJson(
            {
              category: {
                id: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  shortDescription: 'short description',
                  children: [],
                  updated: new Date(),
                },
              },
              risk: {},
            },
            mapper,
          )
          fetchCategory = jest
            .spyOn(repo, 'fetch')
            .mockImplementation(async () => Promise.resolve(fetchedCategoryResult))
        })
        test('Then undefined is returned', async () => {
          const result = await repo.fetchParent('id')
          assertResultOk(result)
          expect(result.value).toBeUndefined()
        })
        test('Then fetch is not called', async () => {
          const result = await repo.fetchParent('id')
          assertResultOk(result)
          expect(fetchCategory.mock.calls).toHaveLength(0)
        })
      })
    })
  })
  describe('repo>category>fetchChildren', () => {
    describe('Given a category ID that has children', () => {
      let mapper: Mocked<CategoryMapper>
      let repo: CategoryRepo
      let child1: Category
      let child2: Category
      let child3: Category

      let fetchCategory: jest.SpyInstance<Promise<Result<Category>>, [id: string]>
      beforeEach(() => {
        mapper = mockDeep<CategoryMapper>()
        child1 = {
          id: 'child1 id',
          name: 'child1 name',
          path: 'child1 path',
          shortDescription: 'child1 short description',
          children: [],
          updated: new Date(),
        }
        child2 = {
          id: 'child2 id',
          name: 'child2 name',
          path: 'child2 path',
          shortDescription: 'child2 short description',
          children: [],
          updated: new Date(),
        }
        child3 = {
          id: 'child3 id',
          name: 'child3 name',
          path: 'child3 path',
          shortDescription: 'child3 short description',
          children: [],
          updated: new Date(),
        }
        repo = newCategoryRepoJson(
          {
            category: {
              'category id': {
                id: 'parent id',
                name: 'parent name',
                path: 'parent path',
                shortDescription: 'parent short description',
                children: ['child1 id', 'child2 id', 'child3 id'],
                updated: new Date(),
              },
            },
            risk: {},
          },
          mapper,
        )
        fetchCategory = jest.spyOn(repo, 'fetch').mockImplementation(async (id) => {
          switch (id) {
            case 'child1 id':
              return Promise.resolve(resultOk(child1))
            case 'child2 id':
              return Promise.resolve(resultOk(child2))
            case 'child3 id':
              return Promise.resolve(resultOk(child3))
            default:
              return Promise.reject()
          }
        })
      })
      describe('When everything succeeds', () => {
        test('Then the fetch results are returned', async () => {
          const childrenResults = await repo.fetchChildren('category id')
          expect(childrenResults.firstErrorResult).toBeUndefined()
          expect(childrenResults.okValues).toEqual([child1, child2, child3])
        })
        test('Then fetch is called for each child', async () => {
          await repo.fetchChildren('category id')
          expect(fetchCategory.mock.calls).toHaveLength(3)
          expect(fetchCategory.mock.calls[0]).toEqual(['child1 id'])
          expect(fetchCategory.mock.calls[1]).toEqual(['child2 id'])
          expect(fetchCategory.mock.calls[2]).toEqual(['child3 id'])
        })
      })
      describe('When the category ID does not exist', () => {
        test('Then a results error is returned', async () => {
          const childrenResults = await repo.fetchChildren('non existent category id')
          expect(childrenResults.firstErrorResult?.message).toBe(`Could not find category 'non existent category id'`)
          expect(childrenResults.okValues).toEqual([])
        })
        test('Then fetch is not called', async () => {
          await repo.fetchChildren('non existent category id')
          expect(fetchCategory.mock.calls).toHaveLength(0)
        })
      })
      describe('When fetch errors for a child ID', () => {
        test('Then the results includes the fetch error', async () => {
          const err = resultError<Category>('fetch error')
          fetchCategory.mockReset()
          fetchCategory.mockImplementation(async (id) => {
            switch (id) {
              case 'child1 id':
                return Promise.resolve(resultOk(child1))
              case 'child2 id':
                return Promise.resolve(err)
              case 'child3 id':
                return Promise.resolve(resultOk(child3))
              default:
                return Promise.reject()
            }
          })
          const childrenResults = await repo.fetchChildren('category id')
          expect(childrenResults.firstErrorResult).toEqual(err)
        })
        test('Then the results includes the fetch successes', async () => {
          const err = resultError<Category>('fetch error')
          fetchCategory.mockReset()
          fetchCategory.mockImplementation(async (id) => {
            switch (id) {
              case 'child1 id':
                return Promise.resolve(resultOk(child1))
              case 'child2 id':
                return Promise.resolve(err)
              case 'child3 id':
                return Promise.resolve(resultOk(child3))
              default:
                return Promise.reject()
            }
          })
          const childrenResults = await repo.fetchChildren('category id')
          expect(childrenResults.okValues).toEqual([child1, child3])
        })
      })
    })
    describe('Given a category ID that has no children', () => {
      let mapper: Mocked<CategoryMapper>
      let repo: CategoryRepo
      let fetchCategory: jest.SpyInstance<Promise<Result<Category>>, [id: string]>
      beforeEach(() => {
        mapper = mockDeep<CategoryMapper>()
        repo = newCategoryRepoJson(
          {
            category: {
              'category id': {
                id: 'parent id',
                name: 'parent name',
                path: 'parent path',
                shortDescription: 'parent short description',
                children: [],
                updated: new Date(),
              },
            },
            risk: {},
          },
          mapper,
        )
        fetchCategory = jest.spyOn(repo, 'fetch')
      })
      describe('When everything succeeds', () => {
        test('Then an empty results is returned', async () => {
          const childrenResults = await repo.fetchChildren('category id')
          expect(childrenResults.firstErrorResult).toBeUndefined()
          expect(childrenResults.okValues).toEqual([])
        })
        test('Then fetch is not called', async () => {
          await repo.fetchChildren('category id')
          expect(fetchCategory.mock.calls).toHaveLength(0)
        })
      })
    })
  })

  describe('repo>category>list', () => {
    describe('Given a request', () => {
      describe('When onlyRoot is true', () => {
        describe('and everything succeeds', () => {
          test('Then the root mapped categories are returned', async () => {
            const root1Mapped: Category = {
              id: 'root1 mapped id',
              name: 'root1 mapped name',
              path: 'root1 mapped path',
              shortDescription: 'root1 short description',
              children: [],
              updated: new Date(),
            }
            const child1Mapped: Category = {
              id: 'child1 mapped id',
              name: 'child1 mapped name',
              path: 'child1 mapped path',
              shortDescription: 'child1 short description',
              children: [],
              updated: new Date(),
            }
            const root2Mapped: Category = {
              id: 'root2 mapped id',
              name: 'root2 mapped name',
              path: 'root2 mapped path',
              shortDescription: 'root2 short description',
              children: [],
              updated: new Date(),
            }
            const child2Mapped: Category = {
              id: 'child2 mapped id',
              name: 'child2 mapped name',
              path: 'child2 mapped path',
              shortDescription: 'child2 short description',
              children: [],
              updated: new Date(),
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

            const root1Repo: CategoryJson = {
              id: 'root1 id',
              name: 'root1 name',
              path: 'root1 path',
              shortDescription: 'root1 short description',
              children: ['child1 id'],
              updated: new Date(),
            }
            const child1Repo: CategoryJson = {
              id: 'child1 id',
              name: 'child1 name',
              path: 'child1 path',
              shortDescription: 'child1 short description',
              parentId: 'root1 id',
              children: [],
              updated: new Date(),
            }
            const root2Repo: CategoryJson = {
              id: 'root2 id',
              name: 'root2 name',
              path: 'root2 path',
              shortDescription: 'root2 short description',
              children: ['child2 id'],
              updated: new Date(),
            }
            const child2Repo: CategoryJson = {
              id: 'child2 id',
              name: 'child2 name',
              path: 'child2 path',
              shortDescription: 'child2 short description',
              parentId: 'child1 id',
              children: [],
              updated: new Date(),
            }
            const repo = newCategoryRepoJson(
              {
                category: {
                  'root1 id': root1Repo,
                  'child1 id': child1Repo,
                  'root2 id': root2Repo,
                  'child2 id': child2Repo,
                },
                risk: {},
              },
              mapper,
            )

            const result = await repo.list({ onlyRoot: true })
            expect(result.firstErrorResult).toBeUndefined()
            const categories = result.okValues
            expect(categories).toHaveLength(2)
            expect(categories[0]).toEqual(root1Mapped)
            expect(categories[1]).toEqual(root2Mapped)
            expect(fromJson.mock.calls).toHaveLength(4)
            // root1Repo is fetched first, which calls fromJson for child1Repo first then root1Repo
            expect(fromJson.mock.calls[0]).toEqual([child1Repo, undefined, []])
            expect(fromJson.mock.calls[1]).toEqual([root1Repo, undefined, [child1Mapped]])
            // root2Repo is fetched next, which calls fromJson for child2Repo first then root2Repo
            expect(fromJson.mock.calls[2]).toEqual([child2Repo, undefined, []])
            expect(fromJson.mock.calls[3]).toEqual([root2Repo, undefined, [child2Mapped]])
          })
        })
        describe('and fetching a category errors', () => {
          test('Then the same error result is returned', async () => {
            const mapperError = resultError('error')
            const fromJson: jest.MockedFunction<CategoryMapper['fromJson']> = jest.fn().mockReturnValueOnce(mapperError)
            const mapper: CategoryMapper = {
              fromJson,
              toJson: jest.fn(),
            }

            const root1Repo: CategoryJson = {
              id: 'root1 id',
              name: 'root1 name',
              path: 'root1 path',
              shortDescription: 'root1 short description',
              children: ['child1 id'],
              updated: new Date(),
            }
            const category1Repo: CategoryJson = {
              id: 'child1 id',
              name: 'child1 name',
              path: 'child1 path',
              shortDescription: 'child1 short description',
              parentId: 'root1 id',
              children: [],
              updated: new Date(),
            }
            const repo = newCategoryRepoJson(
              {
                category: {
                  'root1 id': root1Repo,
                  'child1 id': category1Repo,
                },
                risk: {},
              },
              mapper,
            )

            const result = await repo.list({ onlyRoot: true })
            expect(result.firstErrorResult).toBe(mapperError)
            expect(result.okValues).toEqual([])
            expect(result.values).toEqual([undefined])
          })
        })
      })
      describe('When onlyRoot is false', () => {
        test('Then all mapped categories are returned', async () => {
          const root1Mapped: Category = {
            id: 'root1 mapped id',
            name: 'root1 mapped name',
            path: 'root1 mapped path',
            shortDescription: 'root1 short description',
            children: [],
            updated: new Date(),
          }
          const child1Mapped: Category = {
            id: 'child1 mapped id',
            name: 'child1 mapped name',
            path: 'child1 mapped path',
            shortDescription: 'child1 short description',
            children: [],
            updated: new Date(),
          }
          const root2Mapped: Category = {
            id: 'root2 mapped id',
            name: 'root2 mapped name',
            path: 'root2 mapped path',
            shortDescription: 'root2 short description',
            children: [],
            updated: new Date(),
          }
          const child2Mapped: Category = {
            id: 'child2 mapped id',
            name: 'child2 mapped name',
            path: 'child2 mapped path',
            shortDescription: 'child2 short description',
            children: [],
            updated: new Date(),
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

          const root1Repo: CategoryJson = {
            id: 'root1 id',
            name: 'root1 name',
            path: 'root1 path',
            shortDescription: 'root1 short description',
            children: ['child1 id'],
            updated: new Date(),
          }
          const child1Repo: CategoryJson = {
            id: 'child1 id',
            name: 'child1 name',
            path: 'child1 path',
            shortDescription: 'child1 short description',
            parentId: 'root1 id',
            children: [],
            updated: new Date(),
          }
          const root2Repo: CategoryJson = {
            id: 'root2 id',
            name: 'root2 name',
            path: 'root2 path',
            shortDescription: 'root2 short description',
            children: ['child2 id'],
            updated: new Date(),
          }
          const child2Repo: CategoryJson = {
            id: 'child2 id',
            name: 'child2 name',
            path: 'child2 path',
            shortDescription: 'child2 short description',
            parentId: 'child1 id',
            children: [],
            updated: new Date(),
          }
          const repo = newCategoryRepoJson(
            {
              category: {
                'root1 id': root1Repo,
                'child1 id': child1Repo,
                'root2 id': root2Repo,
                'child2 id': child2Repo,
              },
              risk: {},
            },
            mapper,
          )

          const result = await repo.list({ onlyRoot: false })
          expect(result.firstErrorResult).toBeUndefined()
          const categories = result.okValues
          expect(categories).toHaveLength(4)
          expect(categories[0]).toEqual(root1Mapped)
          expect(categories[1]).toEqual(child1Mapped)
          expect(categories[2]).toEqual(root2Mapped)
          expect(categories[3]).toEqual(child2Mapped)
          expect(fromJson.mock.calls).toHaveLength(8)
          // root1Repo is fetched, which calls fromJson for child1Repo then itself
          expect(fromJson.mock.calls[0]).toEqual([child1Repo, undefined, []])
          expect(fromJson.mock.calls[1]).toEqual([root1Repo, undefined, [child1Mapped]])
          // child1Repo is fetched, which calls fromJson for root1Repo then itself
          expect(fromJson.mock.calls[2]).toEqual([root1Repo, undefined, []])
          expect(fromJson.mock.calls[3]).toEqual([child1Repo, root1Mapped, []])
          // root2Repo is fetched, which calls fromJson for child2Repo then itself
          expect(fromJson.mock.calls[4]).toEqual([child2Repo, undefined, []])
          expect(fromJson.mock.calls[5]).toEqual([root2Repo, undefined, [child2Mapped]])
          // child2Repo is fetched, which calls fromJson for child1Repo then itself
          expect(fromJson.mock.calls[6]).toEqual([child1Repo, undefined, []])
          expect(fromJson.mock.calls[7]).toEqual([child2Repo, child1Mapped, []])
        })
      })
    })
  })
})
