import { Updated as UpdatedDomain } from '@life/updated'
import { ResultError, Results, results, resultsOk } from '@helper/result'
import { ListInteractor, ListMapper, newListInteractor } from '@life/usecase/updated/list'
import type { ListRepo } from '@life/usecase/updated/list'
import { Updated, Category, Risk } from '@life/usecase/mapper'
import { newCategory } from '@life/category'
import {
  CategoryTopLevel as CategoryTopLevelDomain,
  Impact as ImpactDomain,
  Likelihood as LikelihoodDomain,
  Risk as RiskDomain,
  RiskType as RiskTypeDomain,
} from '@life/risk'
import { newIdentifier } from '@helper/identifier'
import { assertResultOk } from '@helper/testing'

describe('usecase>updated>list', () => {
  describe('Given a ListInteractor', () => {
    let repoList: jest.MockedFunction<ListRepo['list']>
    let mapperUpdated: jest.MockedFunction<ListMapper['updated']>
    let repoUpdated: UpdatedDomain[]
    let mappedUpdated: Updated[]
    let interactor: ListInteractor
    let categoryMapped: Category
    let riskMapped: Risk
    beforeEach(() => {
      const idResult = newIdentifier('id 1')
      assertResultOk(idResult)

      const categoryResult = newCategory({
        id: idResult.value,
        name: 'name 1',
        slug: 'slug 1',
        previousSlugs: ['prev 1', 'ious 1'],
        path: '/path 1',
        previousPaths: ['/prev1 1', '/prev2 1'],
        description: 'description 1',
        shortDescription: 'short description 1',
        children: [],
        parent: undefined,
        updated: new Date(),
      })
      assertResultOk(categoryResult)
      const category = categoryResult.value

      const testUpdated: RiskDomain = {
        id: {
          __entity: 'Identifier',
          val: 'id 1',
        },
        name: 'name 1',
        category: CategoryTopLevelDomain.Health,
        impact: ImpactDomain.High,
        likelihood: LikelihoodDomain.High,
        type: RiskTypeDomain.Condition,
        shortDescription: 'short description 1',
        updated: new Date(),
      }
      repoUpdated = [category, testUpdated]
      categoryMapped = {
        id: 'id 1',
        name: 'name 1',
        slug: 'slug 1',
        previousSlugs: ['prev', 'ious'],
        path: '/path 1',
        previousPaths: ['/prev1 1', '/prev2 1'],
        description: 'description 1',
        shortDescription: 'short description 1',
        children: [],
        parent: undefined,
        updated: new Date(),
      }
      riskMapped = {
        id: 'id 1',
        name: 'name 1',
        category: 'Health',
        impact: 'High',
        likelihood: 'High',
        type: 'Condition',
        shortDescription: 'short description 1',
        updated: new Date(),
      }
      mappedUpdated = [categoryMapped, riskMapped]
      repoList = jest.fn()
      mapperUpdated = jest.fn().mockReturnValueOnce(resultsOk(mappedUpdated))
      interactor = newListInteractor(
        {
          list: repoList,
        },
        {
          updated: mapperUpdated,
        },
      )
    })
    describe('When everything succeeds', () => {
      beforeEach(() => {
        repoList.mockReturnValueOnce(
          Promise.resolve({
            values: repoUpdated,
            firstErrorResult: undefined,
            okValues: repoUpdated,
          } as Results<UpdatedDomain>),
        )
      })

      test('Then the mapped result is returned', async () => {
        const updatedResult = await interactor.list({ count: 10 })
        expect(updatedResult.firstErrorResult).toBeUndefined()
        expect(updatedResult.okValues).toStrictEqual(mappedUpdated)

        // And the categories are fetched
        expect(repoList.mock.calls).toHaveLength(1)
        expect(repoList.mock.calls[0][0]).toEqual({ count: 10 })
      })
    })
    describe('When listing from the repo errors', () => {
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
            results<UpdatedDomain>([
              errorResult,
              {
                ok: true,
                value: {
                  __entity: 'Category',
                  id: {
                    __entity: 'Identifier',
                    val: 'id',
                  },
                  name: 'name',
                  slug: 'slug',
                  previousSlugs: ['prev', 'ious'],
                  path: '/path',
                  previousPaths: ['/prev1', '/prev2'],
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
        const categoriesResult = await interactor.list({ count: 10 })
        expect(categoriesResult.firstErrorResult).toEqual(errorResult)
        expect(categoriesResult.okValues).toStrictEqual([])
        expect(categoriesResult.values).toEqual([undefined])

        // And the categories are fetched
        expect(repoList.mock.calls).toHaveLength(1)
        expect(repoList.mock.calls[0][0]).toEqual({ count: 10 })
      })
    })
    describe('When mapping errors', () => {
      let errorResult: ResultError
      beforeEach(() => {
        repoList.mockReturnValueOnce(
          Promise.resolve({
            values: repoUpdated,
            firstErrorResult: undefined,
            okValues: repoUpdated,
          } as Results<UpdatedDomain>),
        )
        errorResult = {
          ok: false,
          error: new Error('repo error'),
          message: 'repo error message',
          metadata: {},
        }
        mapperUpdated.mockReset().mockReturnValueOnce(
          results<Updated>([
            errorResult,
            {
              ok: true,
              value: {
                id: 'id',
                name: 'name',
                slug: 'slug',
                previousSlugs: ['prev', 'ious'],
                path: '/path',
                previousPaths: ['/prev1', '/prev2'],
                shortDescription: 'short description',
                children: [],
                updated: new Date(),
              },
            },
          ]),
        )
      })

      test('Then only the error result is returned', async () => {
        const categoriesResult = await interactor.list({ count: 10 })
        expect(categoriesResult.firstErrorResult).toEqual(errorResult)
        expect(categoriesResult.okValues).toStrictEqual([])
        expect(categoriesResult.values).toEqual([undefined])

        // And the categories are fetched
        expect(repoList.mock.calls).toHaveLength(1)
        expect(repoList.mock.calls[0][0]).toEqual({ count: 10 })
      })
    })
  })
})
