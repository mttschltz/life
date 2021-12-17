import { CategoryTopLevel, Impact, Likelihood, newRisk, Risk, RiskType } from '@life/risk'
import { assertResultError, assertResultOk } from '@util/testing'
import { Result, ResultError } from '@util/result'
import { CreateRiskInteractor, CreateRiskRepo, CreateRiskRequest } from '@life/usecase/risk/createRisk'
import { Risk as UsecaseRisk } from '@life/usecase/mapper'

jest.mock('@life/risk')

describe('createRisk', () => {
  describe('Given a CreateRiskInteractor', () => {
    let fetchRepo: jest.MockedFunction<CreateRiskRepo['fetchRisk']>
    let createRepo: jest.MockedFunction<CreateRiskRepo['createRisk']>
    let mappedRisk: UsecaseRisk
    let interactor: CreateRiskInteractor
    let newRiskMock: jest.MockedFunction<typeof newRisk>
    let risk: Risk
    let parentRisk: Risk

    beforeEach(() => {
      // Risks
      risk = {
        id: 'uri-part',
        category: CategoryTopLevel.Health,
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'name',
        type: RiskType.Condition,
        notes: undefined,
        parent: undefined,
      }
      parentRisk = {
        id: 'parent id',
        category: CategoryTopLevel.Health,
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'parent name',
        type: RiskType.Condition,
        notes: undefined,
        parent: undefined,
      }
      newRiskMock = newRisk as jest.MockedFunction<typeof newRisk>
      newRiskMock.mockImplementation(
        () =>
          ({
            value: risk,
            ok: true,
          } as Result<Risk>),
      )
      // Repos
      fetchRepo = jest.fn()
      fetchRepo.mockImplementation(async () =>
        Promise.resolve({
          value: parentRisk,
          ok: true,
        } as Result<Risk>),
      )
      createRepo = jest.fn()
      createRepo.mockImplementation(async () =>
        Promise.resolve({
          value: undefined,
          ok: true,
        } as Result<undefined>),
      )
      // Mapper
      mappedRisk = {
        category: CategoryTopLevel.Health,
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
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          risks: () => {
            throw new Error('Unexpected call')
          },
        },
      )
    })

    describe('And a CreateRiskRequest', () => {
      let createDetails: CreateRiskRequest

      beforeEach(() => {
        createDetails = {
          category: CategoryTopLevel.Health,
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
        test('Then the expected result is returned', async () => {
          const riskResult = await interactor.createRisk(createDetails)
          assertResultOk(riskResult)
          expect(riskResult.value).toBe(mappedRisk)

          // And the parent risk is fetched
          expect(fetchRepo).toHaveBeenCalledTimes(1)
          expect(fetchRepo.mock.calls[0]).toEqual(['parent id'])

          // And the risk is constructed as expected
          expect(newRiskMock).toHaveBeenCalledTimes(1)
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
          expect(createRepo).toHaveBeenCalledTimes(1)
          expect(createRepo.mock.calls[0]).toEqual([risk])
        })
      })
      describe('When the URI part is invalid', () => {
        test('Then an error is returned', async () => {
          let riskResult = await interactor.createRisk({ ...createDetails, uriPart: '' })
          assertResultError(riskResult)
          assertResultError(riskResult)
          expect(riskResult.message).toBe("Invalid URI part: ''")

          riskResult = await interactor.createRisk({ ...createDetails, uriPart: ' ' })
          assertResultError(riskResult)
          expect(riskResult.message).toBe("Invalid URI part: ' '")

          riskResult = await interactor.createRisk({ ...createDetails, uriPart: '^' })
          assertResultError(riskResult)
          expect(riskResult.message).toBe("Invalid URI part: '^'")

          riskResult = await interactor.createRisk({ ...createDetails, uriPart: '/start-with-slash' })
          assertResultError(riskResult)
          expect(riskResult.message).toBe("Invalid URI part: '/start-with-slash'")
        })
      })
      describe('When fetching the parent fails', () => {
        test('Then an error is returned', async () => {
          fetchRepo.mockImplementationOnce(async () =>
            Promise.resolve({
              message: 'fetch repo error',
            } as ResultError),
          )
          const riskResult = await interactor.createRisk({ ...createDetails })
          assertResultError(riskResult)
          expect(riskResult.message).toBe('fetch repo error')
        })
      })
      describe('When creating the risk fails', () => {
        beforeEach(() => {
          newRiskMock.mockImplementationOnce(
            () =>
              ({
                message: 'create entity error',
              } as ResultError),
          )
        })
        test('Then an error is returned', async () => {
          const riskResult = await interactor.createRisk({ ...createDetails })
          assertResultError(riskResult)
          expect(riskResult.message).toBe('create entity error')
        })
      })
      describe('When persisting the risk fails', () => {
        beforeEach(() => {
          createRepo.mockImplementationOnce(async () =>
            Promise.resolve({
              message: 'create repo error',
            } as ResultError),
          )
        })
        test('Then an error is returned', async () => {
          const riskResult = await interactor.createRisk({ ...createDetails })
          assertResultError(riskResult)
          expect(riskResult.message).toBe('create repo error')
        })
      })
    })
    describe('And a CreateRiskRequest without optional details', () => {
      let createDetails: CreateRiskRequest

      beforeEach(() => {
        createDetails = {
          category: CategoryTopLevel.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          name: 'name',
          type: RiskType.Condition,
          uriPart: 'uri-part-1',
        }
      })
      describe('When everything suceeds', () => {
        test('Then the expected result is returned', async () => {
          const riskResult = await interactor.createRisk(createDetails)
          assertResultOk(riskResult)
          const usecaseRisk = riskResult.value
          expect(usecaseRisk).toBe(mappedRisk)

          // And the parent risk is not fetched
          expect(fetchRepo).not.toHaveBeenCalled()

          // And the risk is constructed as expected
          expect(newRiskMock).toHaveBeenCalledTimes(1)
          expect(newRiskMock.mock.calls[0]).toEqual([
            'uri-part-1',
            {
              ...createDetails,
              uriPart: undefined,
              notes: undefined,
              parentId: undefined,
            },
          ])

          // And the risk is persisted to the repo
          expect(createRepo).toHaveBeenCalledTimes(1)
          expect(createRepo.mock.calls[0]).toEqual([risk])
        })
      })
    })
  })
})