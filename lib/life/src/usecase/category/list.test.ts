import { Category } from '@life/category'
import { ResultError, results, Results } from '@util/result'
import { ListInteractor, newListInteractor } from '@life/usecase/category/list'
import type { ListRepo } from '@life/usecase/category/list'
import { Category as UsecaseCategory } from '@life/usecase/mapper'

describe('usecase>category>list', () => {
  describe('Given a ListInteractor', () => {
    let repoList: jest.MockedFunction<ListRepo['list']>
    let repoCategories: Category[]
    let mappedCategories: UsecaseCategory[]
    let interactor: ListInteractor
    beforeEach(() => {
      repoList = jest.fn()
      repoCategories = [
        {
          id: 'id 1',
          name: 'name 1',
          path: 'path 1',
          description: 'description 1',
          children: [],
          parent: undefined,
        },
        {
          id: 'id 2',
          name: 'name 2',
          path: 'path 2',
          description: 'description 2',
          children: [
            {
              id: 'id child',
              name: 'name child',
              path: 'path child',
              description: 'path description',
              children: [],
            },
          ],
          parent: {
            id: 'id parent',
            name: 'name parent',
            path: 'path parent',
            description: 'description parent',
            children: [],
          },
        },
      ]
      mappedCategories = [
        {
          id: 'id 1',
          name: 'name 1',
          path: 'path 1',
          description: 'description 1',
          children: [],
          parent: undefined,
        },
        {
          id: 'id 2',
          name: 'name 2',
          path: 'path 2',
          description: 'description 2',
          children: [
            {
              id: 'id child',
              name: 'name child',
              path: 'path child',
              description: 'path description',
              children: [],
            },
          ],
          parent: {
            id: 'id parent',
            name: 'name parent',
            path: 'path parent',
            description: 'description parent',
            children: [],
          },
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
          } as Results<Category>),
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
            results<Category>([
              errorResult,
              {
                ok: true,
                value: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  children: [],
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
