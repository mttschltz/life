import { Category } from '@life/category'
import { CategoryTopLevel, Impact, Likelihood, Risk, RiskType } from '@life/risk'
import { results, resultsError, resultsOk } from '@util/result'
import { mockThrows } from '@util/testing'
import { CategoryRepoJson } from './category'
import { RiskRepoJson } from './risk'
import { newUpdatedRepoJson } from './updated'

describe('UpdatedRepoJson', () => {
  describe('list', () => {
    let listCategories: jest.MockedFunction<CategoryRepoJson['list']>
    let listRisks: jest.MockedFunction<RiskRepoJson['list']>
    let categoryRepo: CategoryRepoJson
    let riskRepo: RiskRepoJson
    beforeEach(() => {
      listCategories = jest.fn()
      categoryRepo = {
        list: listCategories,
        fetch: mockThrows('unexpected fetch call'),
        fetchChildren: mockThrows('unexpected fetchChildren call'),
        fetchParent: mockThrows('unexpected fetchParent call'),
      }
      listRisks = jest.fn()
      riskRepo = {
        list: listRisks,
        createRisk: mockThrows('unexpected createRisk call'),
        fetchRisk: mockThrows('unexpected fetchRisk call'),
        fetchRiskChildren: mockThrows('unexpected fetchRiskChildren call'),
        fetchRiskParent: mockThrows('unexpected fetchRiskParent call'),
      }
    })
    describe('Given no categories or risks', () => {
      describe('When a count of 2 is requested', () => {
        test('Then no results are returned', async () => {
          listCategories.mockResolvedValueOnce(results<Category>([]))
          listRisks.mockResolvedValueOnce(results<Risk>([]))

          const repo = newUpdatedRepoJson(categoryRepo, riskRepo)
          const updatedResults = await repo.list({ count: 2 })
          expect(updatedResults.firstErrorResult).toBeUndefined()
          expect(updatedResults.okValues).toHaveLength(0)

          expect(listCategories.mock.calls).toHaveLength(1)
          expect(listCategories.mock.calls[0]).toEqual([{ onlyRoot: false }])
          expect(listRisks.mock.calls).toHaveLength(1)
          expect(listRisks.mock.calls[0]).toEqual([undefined, true])
        })
      })
      describe('When listing categories errors', () => {
        test('Then the error is returned', async () => {
          listCategories.mockResolvedValueOnce(resultsError<Category>('error listing categories'))
          listRisks.mockResolvedValueOnce(results<Risk>([]))

          const repo = newUpdatedRepoJson(categoryRepo, riskRepo)
          const updatedResults = await repo.list({ count: 2 })
          expect(updatedResults.firstErrorResult).toBeDefined()
          expect(updatedResults.firstErrorResult?.message).toBe('error listing categories')
        })
      })
      describe('When listing risks errors', () => {
        test('Then the error is returned', async () => {
          listCategories.mockResolvedValueOnce(results<Category>([]))
          listRisks.mockResolvedValueOnce(resultsError<Risk>('error listing risks'))

          const repo = newUpdatedRepoJson(categoryRepo, riskRepo)
          const updatedResults = await repo.list({ count: 2 })
          expect(updatedResults.firstErrorResult).toBeDefined()
          expect(updatedResults.firstErrorResult?.message).toBe('error listing risks')
        })
      })
    })
    describe('Given 4 categories and no risks', () => {
      let category1: Category
      let category2: Category
      let category3: Category
      let category4: Category
      beforeEach(() => {
        category1 = {
          id: 'id 1',
          name: 'name 1',
          path: 'path 1',
          shortDescription: 'short desc',
          updated: new Date('2022-01-10 08:00'),
          children: [],
        }
        category2 = {
          id: 'id 2',
          name: 'name 2',
          path: 'path 2',
          shortDescription: 'short desc',
          updated: new Date('2022-01-10 09:00'),
          children: [],
        }
        category3 = {
          id: 'id 3',
          name: 'name 3',
          path: 'path 3',
          shortDescription: 'short desc',
          updated: new Date('2022-01-10 11:00'),
          children: [],
        }
        category4 = {
          id: 'id 4',
          name: 'name 4',
          path: 'path 4',
          shortDescription: 'short desc',
          updated: new Date('2022-01-10 10:00'),
          children: [],
        }
        listCategories.mockResolvedValueOnce(resultsOk<Category>([category1, category2, category3, category4]))
        listRisks.mockResolvedValueOnce(results<Risk>([]))
      })
      describe('When a count of 2 is requested', () => {
        test('Then the 2 most recently updated categories are returned, in reverse chronological order', async () => {
          const repo = newUpdatedRepoJson(categoryRepo, riskRepo)
          const updatedResults = await repo.list({ count: 2 })
          expect(updatedResults.firstErrorResult).toBeUndefined()
          expect(updatedResults.okValues).toHaveLength(2)
          expect(updatedResults.okValues).toEqual([category3, category4])

          expect(listCategories.mock.calls).toHaveLength(1)
          expect(listCategories.mock.calls[0]).toEqual([{ onlyRoot: false }])
          expect(listRisks.mock.calls).toHaveLength(1)
          expect(listRisks.mock.calls[0]).toEqual([undefined, true])
        })
      })
      describe('When a count of 6 is requested', () => {
        test('Then the 4 categories are returned in reverse chronological order', async () => {
          const repo = newUpdatedRepoJson(categoryRepo, riskRepo)
          const updatedResults = await repo.list({ count: 6 })
          expect(updatedResults.firstErrorResult).toBeUndefined()
          expect(updatedResults.okValues).toHaveLength(4)
          expect(updatedResults.okValues).toEqual([category3, category4, category2, category1])

          expect(listCategories.mock.calls).toHaveLength(1)
          expect(listCategories.mock.calls[0]).toEqual([{ onlyRoot: false }])
          expect(listRisks.mock.calls).toHaveLength(1)
          expect(listRisks.mock.calls[0]).toEqual([undefined, true])
        })
      })
    })
    describe('Given no categories and 4 risks', () => {
      let risk1: Risk
      let risk2: Risk
      let risk3: Risk
      let risk4: Risk
      beforeEach(() => {
        risk1 = {
          id: 'id 1',
          name: 'name 1',
          shortDescription: 'short desc 1',
          category: CategoryTopLevel.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          type: RiskType.Condition,
          updated: new Date('2022-01-10 08:00'),
        }
        risk2 = {
          id: 'id 2',
          name: 'name 2',
          shortDescription: 'short desc 2',
          category: CategoryTopLevel.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          type: RiskType.Condition,
          updated: new Date('2022-01-10 09:00'),
        }
        risk3 = {
          id: 'id 3',
          name: 'name 3',
          shortDescription: 'short desc 3',
          category: CategoryTopLevel.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          type: RiskType.Condition,
          updated: new Date('2022-01-10 11:00'),
        }
        risk4 = {
          id: 'id 4',
          name: 'name 4',
          shortDescription: 'short desc 4',
          category: CategoryTopLevel.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          type: RiskType.Condition,
          updated: new Date('2022-01-10 10:00'),
        }
        listCategories.mockResolvedValueOnce(results<Category>([]))
        listRisks.mockResolvedValueOnce(resultsOk<Risk>([risk1, risk2, risk3, risk4]))
      })
      describe('When a count of 2 is requested', () => {
        test('Then the 2 most recently updated risks are returned, in reverse chronological order', async () => {
          const repo = newUpdatedRepoJson(categoryRepo, riskRepo)
          const updatedResults = await repo.list({ count: 2 })
          expect(updatedResults.firstErrorResult).toBeUndefined()
          expect(updatedResults.okValues).toHaveLength(2)
          expect(updatedResults.okValues).toEqual([risk3, risk4])

          expect(listCategories.mock.calls).toHaveLength(1)
          expect(listCategories.mock.calls[0]).toEqual([{ onlyRoot: false }])
          expect(listRisks.mock.calls).toHaveLength(1)
          expect(listRisks.mock.calls[0]).toEqual([undefined, true])
        })
      })
      describe('When a count of 6 is requested', () => {
        test('Then the 4 risks are returned in reverse chronological order', async () => {
          const repo = newUpdatedRepoJson(categoryRepo, riskRepo)
          const updatedResults = await repo.list({ count: 4 })
          expect(updatedResults.firstErrorResult).toBeUndefined()
          expect(updatedResults.okValues).toHaveLength(4)
          expect(updatedResults.okValues).toEqual([risk3, risk4, risk2, risk1])

          expect(listCategories.mock.calls).toHaveLength(1)
          expect(listCategories.mock.calls[0]).toEqual([{ onlyRoot: false }])
          expect(listRisks.mock.calls).toHaveLength(1)
          expect(listRisks.mock.calls[0]).toEqual([undefined, true])
        })
      })
    })
    describe('Given 2 categories and 2 risks', () => {
      let risk1: Risk
      let category2: Category
      let risk3: Risk
      let category4: Category
      beforeEach(() => {
        risk1 = {
          id: 'id 1',
          name: 'name 1',
          shortDescription: 'short desc 1',
          category: CategoryTopLevel.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          type: RiskType.Condition,
          updated: new Date('2022-01-10 08:00'),
        }
        category2 = {
          id: 'id 2',
          name: 'name 2',
          path: 'path 2',
          shortDescription: 'short desc',
          updated: new Date('2022-01-10 09:00'),
          children: [],
        }
        risk3 = {
          id: 'id 3',
          name: 'name 3',
          shortDescription: 'short desc 3',
          category: CategoryTopLevel.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          type: RiskType.Condition,
          updated: new Date('2022-01-10 11:00'),
        }
        category4 = {
          id: 'id 4',
          name: 'name 4',
          path: 'path 4',
          shortDescription: 'short desc',
          updated: new Date('2022-01-10 10:00'),
          children: [],
        }
        listCategories.mockResolvedValueOnce(resultsOk<Category>([category2, category4]))
        listRisks.mockResolvedValueOnce(resultsOk<Risk>([risk1, risk3]))
      })
      describe('When a count of 2 is requested', () => {
        test('Then the 2 most recently updated categories or risks are returned, in reverse chronological order', async () => {
          const repo = newUpdatedRepoJson(categoryRepo, riskRepo)
          const updatedResults = await repo.list({ count: 2 })
          expect(updatedResults.firstErrorResult).toBeUndefined()
          expect(updatedResults.okValues).toHaveLength(2)
          expect(updatedResults.okValues).toEqual([risk3, category4])

          expect(listCategories.mock.calls).toHaveLength(1)
          expect(listCategories.mock.calls[0]).toEqual([{ onlyRoot: false }])
          expect(listRisks.mock.calls).toHaveLength(1)
          expect(listRisks.mock.calls[0]).toEqual([undefined, true])
        })
      })
      describe('When a count of 6 is requested', () => {
        test('Then the categories and risks are returned in reverse chronological order', async () => {
          const repo = newUpdatedRepoJson(categoryRepo, riskRepo)
          const updatedResults = await repo.list({ count: 4 })
          expect(updatedResults.firstErrorResult).toBeUndefined()
          expect(updatedResults.okValues).toHaveLength(4)
          expect(updatedResults.okValues).toEqual([risk3, category4, category2, risk1])

          expect(listCategories.mock.calls).toHaveLength(1)
          expect(listCategories.mock.calls[0]).toEqual([{ onlyRoot: false }])
          expect(listRisks.mock.calls).toHaveLength(1)
          expect(listRisks.mock.calls[0]).toEqual([undefined, true])
        })
      })
    })
  })
})
