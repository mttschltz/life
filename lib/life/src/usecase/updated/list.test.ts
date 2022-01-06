import { Updated } from '@life/updated'
import { ResultError, Results, results, resultsOk } from '@util/result'
import { ListUpdatedInteractor, ListUpdatedMapper, newListUpdatedInteractor } from '@life/usecase/updated/list'
import type { ListUpdatedRepo } from '@life/usecase/updated/list'
import { Updated as UpdatedUsecase, Category as CategoryUsecase, Risk as RiskUsecase } from '@life/usecase/mapper'
import { Category } from '@life/category'
import { CategoryTopLevel, Impact, Likelihood, Risk, RiskType } from '@life/risk'

describe('usecase>updated>list', () => {
  describe('Given a ListInteractor', () => {
    let repoList: jest.MockedFunction<ListUpdatedRepo['list']>
    let mapperUpdated: jest.MockedFunction<ListUpdatedMapper['updated']>
    let repoUpdated: Updated[]
    let mappedUpdated: UpdatedUsecase[]
    let interactor: ListUpdatedInteractor
    let categoryMapped: CategoryUsecase
    let riskMapped: RiskUsecase
    beforeEach(() => {
      const category: Category = {
        id: 'id 1',
        name: 'name 1',
        path: 'path 1',
        description: 'description 1',
        shortDescription: 'short description 1',
        children: [],
        parent: undefined,
        updated: new Date(),
      }
      const testUpdated: Risk = {
        id: 'id 1',
        name: 'name 1',
        category: CategoryTopLevel.Health,
        impact: Impact.High,
        likelihood: Likelihood.High,
        type: RiskType.Condition,
        shortDescription: 'short description 1',
        updated: new Date(),
      }
      repoUpdated = [category, testUpdated]
      categoryMapped = {
        ...category,
      }
      riskMapped = {
        ...testUpdated,
      }
      mappedUpdated = [categoryMapped, riskMapped]
      repoList = jest.fn()
      mapperUpdated = jest.fn().mockReturnValueOnce(resultsOk(mappedUpdated))
      interactor = newListUpdatedInteractor(
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
          } as Results<Updated>),
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
        }
        repoList.mockReturnValueOnce(
          Promise.resolve(
            results<Updated>([
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
          } as Results<Updated>),
        )
        errorResult = {
          ok: false,
          error: new Error('repo error'),
          message: 'repo error message',
        }
        mapperUpdated.mockReset().mockReturnValueOnce(
          results<Updated>([
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
