import { Category, Impact, Likelihood, newRisk, Risk, RiskType } from '@life/risk'
import { Result } from '@util'
import { CreateRiskInteractor, CreateRiskRepo, CreateRiskRequest } from './createRisk'
import { Risk as UsecaseRisk } from './mapper'

jest.mock('@life/risk')

describe('createRisk', () => {
  describe('Given a CreateRiskInteractor', () => {
    let fetchRepo: jest.MockedFunction<CreateRiskRepo['fetchRisk']>
    let createRepo: jest.MockedFunction<CreateRiskRepo['createRisk']>
    let mappedRisk: UsecaseRisk
    let interactor: CreateRiskInteractor
    let risk: Risk
    let parentRisk: Risk

    beforeEach(() => {
      // Repos
      fetchRepo = jest.fn()
      createRepo = jest.fn()
      // Mapper
      mappedRisk = {
        category: Category.Health,
        id: 'uri-part',
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'name',
        type: RiskType.Condition,
      }
      // Interactor
      interactor = new CreateRiskInteractor(
        {
          createRisk: createRepo,
          fetchRisk: fetchRepo,
        },
        {
          risk: jest.fn().mockImplementationOnce(() => mappedRisk),
          risks: () => {
            throw new Error('Unexpected call')
          },
        },
      )
      // Risks
      risk = {
        id: 'uri-part',
        category: Category.Health,
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'name',
        type: RiskType.Condition,
        notes: undefined,
        parent: undefined,
      }
      parentRisk = {
        id: 'parent id',
        category: Category.Health,
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'parent name',
        type: RiskType.Condition,
        notes: undefined,
        parent: undefined,
      }
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
        let newRiskMock: jest.MockedFunction<typeof newRisk>
        beforeEach(() => {
          fetchRepo.mockImplementationOnce(async () => Result.success(parentRisk))
          createRepo.mockImplementationOnce(async () => Result.success(undefined))

          newRiskMock = newRisk as jest.MockedFunction<typeof newRisk>
          newRiskMock.mockImplementationOnce(() => Result.success(risk))
        })

        test('Then the expected result is returned', async () => {
          const riskResult = await interactor.createRisk(createDetails)
          expect(riskResult.isSuccess()).toBeTruthy()
          expect(riskResult.getValue()).toBe(mappedRisk)

          // And the parent risk is fetched
          expect(fetchRepo).toBeCalledTimes(1)
          expect(fetchRepo.mock.calls[0]).toEqual(['parent id'])

          // And the risk is constructed as expected
          expect(newRiskMock).toBeCalledTimes(1)
          expect(newRiskMock.mock.calls[0]).toEqual([
            'uri-part',
            {
              ...createDetails,
              uriPart: undefined,
              parentId: undefined,
              parent: parentRisk,
            },
          ])

          // And the risk is persisted to the repo
          expect(createRepo).toBeCalledTimes(1)
          expect(createRepo.mock.calls[0]).toEqual([risk])
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
          fetchRepo.mockImplementationOnce(async () => Result.error('fetch repo error'))
          const riskResult = await interactor.createRisk({ ...createDetails })
          expect(riskResult.isSuccess()).toBeFalsy()
          expect(riskResult.getErrorMessage()).toBe('fetch repo error')
        })
      })
      describe('When creating the risk fails', () => {
        let newRiskMock: jest.MockedFunction<typeof newRisk>
        beforeEach(() => {
          fetchRepo.mockImplementationOnce(async () => Result.success(parentRisk))
          createRepo.mockImplementationOnce(async () => Result.success(undefined))

          newRiskMock = newRisk as jest.MockedFunction<typeof newRisk>
          newRiskMock.mockImplementationOnce(() => Result.error('create entity error'))
        })
        test('Then an error is returned', async () => {
          const riskResult = await interactor.createRisk({ ...createDetails })
          expect(riskResult.isSuccess()).toBeFalsy()
          expect(riskResult.getErrorMessage()).toBe('create entity error')
        })
      })
      describe('When persisting the risk fails', () => {
        let newRiskMock: jest.MockedFunction<typeof newRisk>
        beforeEach(() => {
          fetchRepo.mockImplementationOnce(async () => Result.success(parentRisk))
          createRepo.mockImplementationOnce(async () => Result.error('create repo error'))

          newRiskMock = newRisk as jest.MockedFunction<typeof newRisk>
          newRiskMock.mockImplementationOnce(() => Result.success(risk))
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
        let newRiskMock: jest.MockedFunction<typeof newRisk>
        beforeEach(() => {
          fetchRepo.mockImplementationOnce(async () => Result.success(parentRisk))
          createRepo.mockImplementationOnce(async () => Result.success(undefined))

          newRiskMock = newRisk as jest.MockedFunction<typeof newRisk>
          newRiskMock.mockImplementationOnce(() => Result.success(risk))
        })
        test('Then the expected result is returned', async () => {
          const riskResult = await interactor.createRisk(createDetails)
          expect(riskResult.isSuccess()).toBeTruthy()
          const usecaseRisk = riskResult.getValue()
          expect(usecaseRisk).toBe(mappedRisk)

          // And the parent risk is not fetched
          expect(fetchRepo).not.toBeCalled()

          // And the risk is constructed as expected
          expect(newRiskMock).toBeCalledTimes(1)
          expect(newRiskMock.mock.calls[0]).toEqual([
            'uri-part',
            {
              ...createDetails,
              uriPart: undefined,
              notes: undefined,
              parentId: undefined,
            },
          ])

          // And the risk is persisted to the repo
          expect(createRepo).toBeCalledTimes(1)
          expect(createRepo.mock.calls[0]).toEqual([risk])
        })
      })
    })
  })
})
