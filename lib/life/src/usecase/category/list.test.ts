import { Category as CategoryDomain } from '@life/category'
import { ResultError, results, Results } from '@util/result'
import { ListInteractor, newListInteractor } from '@life/usecase/category/list'
import type { ListRepo } from '@life/usecase/category/list'
import { Category } from '@life/usecase/mapper'

describe('usecase>category>list', () => {
  describe('Given a ListInteractor', () => {
    let repoList: jest.MockedFunction<ListRepo['list']>
    let repoCategories: CategoryDomain[]
    let mappedCategories: Category[]
    let interactor: ListInteractor
    beforeEach(() => {
      repoList = jest.fn()
      repoCategories = [
        {
          id: 'id 1',
          name: 'name 1',
          path: 'path 1',
          description: 'description 1',
          shortDescription: 'short description 1',
          children: [],
          parent: undefined,
          updated: new Date(),
        },
        {
          id: 'id 2',
          name: 'name 2',
          path: 'path 2',
          description: 'description 2',
          shortDescription: 'short description 2',
          parent: {
            id: 'id parent',
            name: 'name parent',
            path: 'path parent',
            description: 'description parent',
            shortDescription: 'short description parent',
            children: [],
            updated: new Date(),
          },
          children: [
            {
              id: 'id child',
              name: 'name child',
              path: 'path child',
              description: 'description child',
              shortDescription: 'short description child',
              children: [],
              updated: new Date(),
            },
          ],
          updated: new Date(),
        },
      ]
      mappedCategories = [
        {
          id: 'id 1',
          name: 'name 1',
          path: 'path 1',
          description: 'description 1',
          shortDescription: 'short description 1',
          children: [],
          parent: undefined,
          updated: new Date(),
        },
        {
          id: 'id 2',
          name: 'name 2',
          path: 'path 2',
          description: 'description 2',
          shortDescription: 'short description 2',
          parent: {
            id: 'id parent',
            name: 'name parent',
            path: 'path parent',
            description: 'description parent',
            shortDescription: 'short description parent',
            children: [],
            updated: new Date(),
          },
          children: [
            {
              id: 'id child',
              name: 'name child',
              path: 'path child',
              description: 'description child',
              shortDescription: 'short description child',
              children: [],
              updated: new Date(),
            },
          ],
          updated: new Date(),
        },
      ]
      interactor = newListInteractor(
        {
          list: repoList,
        },
        {
          categories: jest.fn().mockImplementationOnce(() => mappedCategories),
        },
      )
    })
    describe('When everything succeeds', () => {
      beforeEach(() => {
        repoList.mockReturnValueOnce(
          Promise.resolve({
            values: repoCategories,
            firstErrorResult: undefined,
            okValues: repoCategories,
          } as Results<CategoryDomain>),
        )
      })

      test('Then the mapped result is returned', async () => {
        const categoriesResult = await interactor.list()
        expect(categoriesResult.firstErrorResult).toBeUndefined()
        expect(categoriesResult.okValues).toStrictEqual(mappedCategories)

        // And the categories are fetched
        expect(repoList.mock.calls).toHaveLength(1)
        expect(repoList.mock.calls[0][0]).toEqual({ includeChildren: true })
      })
    })
    describe('When listing from the repo errors on one category', () => {
      let errorResult: ResultError
      beforeEach(() => {
        errorResult = {
          ok: false,
          error: new Error('repo error'),
          message: 'repo error message',
        }
        repoList.mockReturnValueOnce(
          Promise.resolve(
            results<CategoryDomain>([
              errorResult,
              {
                ok: true,
                value: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  shortDescription: 'short description',
                  children: [],
                  updated: new Date(),
                },
              },
            ]),
          ),
        )
      })

      test('Then only the error result is returned', async () => {
        const categoriesResult = await interactor.list()
        expect(categoriesResult.firstErrorResult).toEqual(errorResult)
        expect(categoriesResult.okValues).toStrictEqual([])
        expect(categoriesResult.values).toEqual([undefined])

        // And the categories are fetched
        expect(repoList.mock.calls).toHaveLength(1)
        expect(repoList.mock.calls[0][0]).toEqual({ includeChildren: true })
      })
    })
  })
})
