import { Category as CategoryDomain } from '@life/category'
import { ResultError, results, Results } from '@helper/result'
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
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'id 1' },
          name: 'name 1',
          slug: 'slug 1',
          previousSlugs: ['prev 1', 'ious 1'],
          description: 'description 1',
          shortDescription: 'short description 1',
          children: [],
          parent: undefined,
          updated: new Date(),
        },
        {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'id 2' },
          name: 'name 2',
          slug: 'slug 2',
          previousSlugs: ['prev 2', 'ious 2'],
          description: 'description 2',
          shortDescription: 'short description 2',
          parent: {
            __entity: 'Category',
            id: { __entity: 'Identifier', val: 'id parent' },
            name: 'name parent',
            slug: 'slug parent',
            previousSlugs: ['prev parent', 'ious parent'],
            description: 'description parent',
            shortDescription: 'short description parent',
            children: [],
            updated: new Date(),
          },
          children: [
            {
              __entity: 'Category',
              id: { __entity: 'Identifier', val: 'id child' },
              name: 'name child',
              slug: 'slug child',
              previousSlugs: ['prev child', 'ious child'],
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
          slug: 'slug 1',
          previousSlugs: ['prev 1', 'ious 1'],
          description: 'description 1',
          shortDescription: 'short description 1',
          children: [],
          parent: undefined,
          updated: new Date(),
        },
        {
          id: 'id 2',
          name: 'name 2',
          slug: 'slug 2',
          previousSlugs: ['prev 2', 'ious 2'],
          description: 'description 2',
          shortDescription: 'short description 2',
          parent: {
            id: 'id parent',
            name: 'name parent',
            slug: 'slug parent',
            previousSlugs: ['prev parent', 'ious parent'],
            description: 'description parent',
            shortDescription: 'short description parent',
            children: [],
            updated: new Date(),
          },
          children: [
            {
              id: 'id child',
              name: 'name child',
              slug: 'slug child',
              previousSlugs: ['prev child', 'ious child'],
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
        expect(repoList.mock.calls[0][0]).toEqual({ onlyRoot: true })
      })
    })
    describe('When listing from the repo errors on one category', () => {
      let errorResult: ResultError
      beforeEach(() => {
        errorResult = {
          ok: false,
          error: new Error('repo error'),
          message: 'repo error message',
          metadata: {},
        }
        repoList.mockReturnValueOnce(
          Promise.resolve(
            results<CategoryDomain>([
              errorResult,
              {
                ok: true,
                value: {
                  __entity: 'Category',
                  id: { __entity: 'Identifier', val: 'id' },
                  name: 'name',
                  slug: 'slug',
                  previousSlugs: ['prev', 'ious'],
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
        expect(repoList.mock.calls[0][0]).toEqual({ onlyRoot: true })
      })
    })
  })
})
