import { Category, Impact, Likelihood, Risk, RiskType } from '@life/risk'
import { Result } from '@util'
import { CreateRiskInteractor, CreateRiskRepo, CreateRiskRequest } from './createRisk'
import { RiskMapper, Risk as UsecaseRisk } from './mapper'

describe('createRisk', () => {
  describe('Given a CreateRiskInteractor', () => {
    let mapper: RiskMapper
    let repo: CreateRiskRepo
    let interactor: CreateRiskInteractor
    let fetchRisk: jest.MockedFunction<CreateRiskRepo['fetchRisk']>
    let createRisk: jest.MockedFunction<CreateRiskRepo['createRisk']>
    let mappedRisk: UsecaseRisk
    let factoryRisk: Result<Risk>
    let riskCreateFactory: jest.SpyInstance<Result<Risk>, Parameters<typeof Risk.create>>
    let repoParentResult: Result<Risk>

    beforeEach(() => {
      // Repos
      fetchRisk = jest.fn()
      createRisk = jest.fn()
      repo = {
        createRisk,
        fetchRisk,
      }
      // Mapper
      mappedRisk = {
        category: Category.Health,
        id: 'uri-part',
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'name',
        type: RiskType.Condition,
      }
      mapper = {
        risk: jest.fn().mockImplementationOnce(() => mappedRisk),
        risks: () => {
          throw new Error('Unexpected call')
        },
      }
      // Interactor
      interactor = new CreateRiskInteractor(repo, mapper)
      // Factory
      factoryRisk = Risk.create('uri-part', {
        category: Category.Health,
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'name',
        type: RiskType.Condition,
        notes: undefined,
        parent: undefined,
      })
      repoParentResult = Risk.create('parent id', {
        category: Category.Health,
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'parent name',
        type: RiskType.Condition,
        notes: undefined,
        parent: undefined,
      })
    })

    describe('And a CreateRiskRequest', () => {
      let createDetails: CreateRiskRequest

      beforeEach(() => {
        createDetails = {
          category: Category.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          name: 'name',
          type: RiskType.Condition,
          uriPart: 'uri-part',
          parentId: 'parent id',
          notes: 'notes',
        }
      })

      describe('When everything succeeds', () => {
        beforeEach(() => {
          fetchRisk.mockImplementationOnce(async () => repoParentResult)
          riskCreateFactory = jest.spyOn(Risk, 'create').mockImplementationOnce(() => factoryRisk)
          riskCreateFactory.mockClear() // Clear after spying as Jest seems to cache the mock
          createRisk.mockImplementationOnce(async () => Result.success(undefined))
        })

        test('Then the expected result is returned', async () => {
          const riskResult = await interactor.createRisk(createDetails)
          expect(riskResult.isSuccess()).toBeTruthy()
          expect(riskResult.getValue()).toBe(mappedRisk)

          // And the parent risk is fetched
          expect(fetchRisk).toBeCalledTimes(1)
          expect(fetchRisk.mock.calls[0]).toEqual(['parent id'])

          // And the risk is created using the class factory
          expect(riskCreateFactory).toBeCalledTimes(1)
          expect(riskCreateFactory.mock.calls[0]).toEqual([
            'uri-part',
            {
              ...createDetails,
              uriPart: undefined,
              parentId: undefined,
              parent: repoParentResult,
            },
          ])

          // And the risk is persisted to the repo
          expect(createRisk).toBeCalledTimes(1)
          expect(createRisk.mock.calls[0]).toEqual([factoryRisk])
        })
      })
      describe('When the URI part is invalid', () => {
        test('Then an error is returned', async () => {
          let riskResult = await interactor.createRisk({ ...createDetails, uriPart: '' })
          expect(riskResult.isSuccess()).toBeFalsy()
          expect(riskResult.getErrorMessage()).toBe("Invalid URI part: ''")

          riskResult = await interactor.createRisk({ ...createDetails, uriPart: ' ' })
          expect(riskResult.isSuccess()).toBeFalsy()
          expect(riskResult.getErrorMessage()).toBe("Invalid URI part: ' '")

          riskResult = await interactor.createRisk({ ...createDetails, uriPart: '^' })
          expect(riskResult.isSuccess()).toBeFalsy()
          expect(riskResult.getErrorMessage()).toBe("Invalid URI part: '^'")
        })
      })
      describe('When fetching the parent fails', () => {
        test('Then an error is returned', async () => {
          fetchRisk.mockImplementationOnce(async () => Result.error('fetch repo error'))
          const riskResult = await interactor.createRisk({ ...createDetails })
          expect(riskResult.isSuccess()).toBeFalsy()
          expect(riskResult.getErrorMessage()).toBe('fetch repo error')
        })
      })
      describe('When creating the risk fails', () => {
        beforeEach(() => {
          fetchRisk.mockImplementationOnce(async () => repoParentResult)
          riskCreateFactory = jest
            .spyOn(Risk, 'create')
            .mockImplementationOnce(() => Result.error('create entity error'))
          riskCreateFactory.mockClear() // Clear after spying as Jest seems to cache the mock
        })
        test('Then an error is returned', async () => {
          // fetchRisk.mockImplementationOnce(async () => Result.error('fetch error'))
          const riskResult = await interactor.createRisk({ ...createDetails })
          expect(riskResult.isSuccess()).toBeFalsy()
          expect(riskResult.getErrorMessage()).toBe('create entity error')
        })
      })
      describe('When persisting the risk fails', () => {
        beforeEach(() => {
          fetchRisk.mockImplementationOnce(async () => repoParentResult)
          createRisk.mockImplementationOnce(async () => Result.error('create repo error'))
        })
        test('Then an error is returned', async () => {
          const riskResult = await interactor.createRisk({ ...createDetails })
          expect(riskResult.isSuccess()).toBeFalsy()
          expect(riskResult.getErrorMessage()).toBe('create repo error')
        })
      })
    })
    describe('And a CreateRiskRequest without optional details', () => {
      let createDetails: CreateRiskRequest

      beforeEach(() => {
        createDetails = {
          category: Category.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          name: 'name',
          type: RiskType.Condition,
          uriPart: 'uri-part',
        }
      })

      describe('When everything suceeds', () => {
        beforeEach(() => {
          riskCreateFactory = jest.spyOn(Risk, 'create').mockImplementationOnce(() => factoryRisk)
          riskCreateFactory.mockClear() // Clear after spying as Jest seems to cache the mock
          createRisk.mockImplementationOnce(async () => Result.success(undefined))
        })
        test('Then the expected result is returned', async () => {
          const riskResult = await interactor.createRisk(createDetails)
          expect(riskResult.isSuccess()).toBeTruthy()
          const usecaseRisk = riskResult.getValue()
          expect(usecaseRisk).toBe(mappedRisk)

          // And the parent risk is not fetched
          expect(fetchRisk).not.toBeCalled()

          // And the risk is created using the class factory
          expect(riskCreateFactory).toBeCalledTimes(1)
          expect(riskCreateFactory.mock.calls[0]).toEqual([
            'uri-part',
            {
              ...createDetails,
              uriPart: undefined,
              notes: undefined,
              parentId: undefined,
            },
          ])

          // And the risk is persisted to the repo
          expect(createRisk).toBeCalledTimes(1)
          expect(createRisk.mock.calls[0]).toEqual([factoryRisk])
        })
      })
    })
  })
})
