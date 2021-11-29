import { Category } from '@life/category'
import { assertResultError, assertResultOk } from '@util/testing'
import { Result, ResultError } from '@util/result'
import { ListCategoriesInteractor } from '@life/usecase/listCategories'
import type { ListCategoriesRepo } from '@life/usecase/listCategories'
import { Category as UsecaseCategory } from '@life/usecase/mapper'

describe('listCategories', () => {
  describe('Given a ListCategoriesInteractor', () => {
    let repoListCategories: jest.MockedFunction<ListCategoriesRepo['listCategories']>
    let repoCategories: Category[]
    let mappedCategories: UsecaseCategory[]
    let interactor: ListCategoriesInteractor
    beforeEach(() => {
      repoListCategories = jest.fn()
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
      interactor = new ListCategoriesInteractor(
        {
          listCategories: repoListCategories,
        },
        {
          categories: jest.fn().mockImplementationOnce(() => mappedCategories),
        },
      )
    })
    describe('When everything succeeds', () => {
      beforeEach(() => {
        repoListCategories.mockReturnValueOnce(
          Promise.resolve({
            value: repoCategories,
            ok: true,
          } as Result<Category[]>),
        )
      })

      test('Then the mapped result is returned', async () => {
        const categoriesResult = await interactor.listCategories()
        assertResultOk(categoriesResult)
        expect(categoriesResult.value).toBe(mappedCategories)

        // And the categories are fetched
        expect(repoListCategories.mock.calls).toHaveLength(1)
        expect(repoListCategories.mock.calls[0][0]).toEqual({ includeChildren: true })
      })
    })
    describe('When listing from the repo errors', () => {
      let errorResult: ResultError
      beforeEach(() => {
        errorResult = {
          ok: false,
          error: new Error('repo error'),
          message: 'repo error message',
        }
        repoListCategories.mockReturnValueOnce(Promise.resolve(errorResult))
      })

      test('Then the error result is returned', async () => {
        const categoriesResult = await interactor.listCategories()
        assertResultError(categoriesResult)
        expect(categoriesResult).toEqual(errorResult)

        // And the categories are fetched
        expect(repoListCategories.mock.calls).toHaveLength(1)
        expect(repoListCategories.mock.calls[0][0]).toEqual({ includeChildren: true })
      })
    })
  })
})
