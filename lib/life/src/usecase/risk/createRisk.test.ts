import {
  CategoryTopLevel as CategoryTopLevelDomain,
  CreateDetails as CreateDetailsDomain,
  Impact as ImpactDomain,
  Likelihood as LikelihoodDomain,
  newRisk,
  Risk as RiskDomain,
  RiskType as RiskTypeDomain,
} from '@life/risk'
import { assertResultError, assertResultOk, mockThrows } from '@util/testing'
import { Result, ResultError } from '@util/result'
import { CreateRiskInteractor, CreateRiskRepo, CreateRiskRequest } from '@life/usecase/risk/createRisk'
import { Risk, RiskMapper } from '@life/usecase/mapper'

jest.mock('@life/risk')

describe('createRisk', () => {
  describe('Given a CreateRiskInteractor', () => {
    describe('Given an interactor and CreateRiskRequest', () => {
      let fetchRepo: jest.MockedFunction<CreateRiskRepo['fetchRisk']>
      let createRepo: jest.MockedFunction<CreateRiskRepo['createRisk']>
      let parentRisk: RiskDomain

      let mapCreateDetails: jest.MockedFunction<RiskMapper['createDetails']>
      let mapRisk: jest.MockedFunction<RiskMapper['risk']>
      let mappedCreateDetails: CreateDetailsDomain
      let mappedRisk: Risk

      let newRiskMock: jest.MockedFunction<typeof newRisk>
      let risk: RiskDomain

      let interactor: CreateRiskInteractor
      let request: CreateRiskRequest

      beforeEach(() => {
        // Repos
        fetchRepo = jest.fn()
        fetchRepo.mockImplementation(async () =>
          Promise.resolve({
            value: parentRisk,
            ok: true,
          } as Result<RiskDomain>),
        )
        createRepo = jest.fn()
        createRepo.mockImplementation(async () =>
          Promise.resolve({
            value: undefined,
            ok: true,
          } as Result<undefined>),
        )
        parentRisk = {
          id: 'parent id',
          category: CategoryTopLevelDomain.Health,
          impact: ImpactDomain.High,
          likelihood: LikelihoodDomain.High,
          name: 'parent name',
          type: RiskTypeDomain.Condition,
          notes: undefined,
          parent: undefined,
          shortDescription: 'parent short description',
          updated: new Date(),
        }

        // Mapper
        mapCreateDetails = jest.fn()
        mapRisk = jest.fn()
        mappedCreateDetails = {
          category: CategoryTopLevelDomain.Health,
          impact: ImpactDomain.High,
          likelihood: LikelihoodDomain.High,
          name: 'name',
          type: RiskTypeDomain.Condition,
          parent: parentRisk,
          notes: 'notes',
          shortDescription: 'short description',
          updated: new Date(),
        }
        mappedRisk = {
          category: 'Health',
          id: 'uri-part',
          impact: 'High',
          likelihood: 'High',
          name: 'name',
          type: 'Condition',
          shortDescription: 'parent short description',
          updated: new Date(),
        }

        // Factory
        risk = {
          id: 'uri-part',
          category: CategoryTopLevelDomain.Health,
          impact: ImpactDomain.High,
          likelihood: LikelihoodDomain.High,
          name: 'name',
          type: RiskTypeDomain.Condition,
          notes: undefined,
          parent: parentRisk,
          shortDescription: 'short description',
          updated: new Date(),
        }
        newRiskMock = newRisk as jest.MockedFunction<typeof newRisk>
        newRiskMock.mockImplementation(
          () =>
            ({
              value: risk,
              ok: true,
            } as Result<RiskDomain>),
        )

        // Interactor and request
        interactor = new CreateRiskInteractor(
          {
            createRisk: createRepo,
            fetchRisk: fetchRepo,
          },
          {
            createDetails: mapCreateDetails.mockReturnValueOnce(mappedCreateDetails),
            risk: mapRisk.mockReturnValueOnce(mappedRisk),
            risks: mockThrows('Unexpected call'),
          },
        )
        request = {
          category: 'Health',
          impact: 'High',
          likelihood: 'High',
          name: 'name',
          type: 'Condition',
          uriPart: 'uri-part',
          parentId: 'parent id',
          notes: 'notes',
          shortDescription: 'short description',
          updated: new Date(),
        }
      })

      describe('When everything succeeds', () => {
        test('Then the expected result is returned', async () => {
          const riskResult = await interactor.createRisk(request)
          assertResultOk(riskResult)
          expect(riskResult.value).toBe(mappedRisk)

          // And the parent risk is fetched
          expect(fetchRepo).toHaveBeenCalledTimes(1)
          expect(fetchRepo.mock.calls[0]).toEqual(['parent id'])

          // And the risk is constructed as expected
          expect(mapCreateDetails.mock.calls).toHaveLength(1)
          expect(mapCreateDetails.mock.calls[0]).toEqual([{ ...request, parent: parentRisk }])
          expect(newRiskMock).toHaveBeenCalledTimes(1)
          expect(newRiskMock.mock.calls[0]).toEqual(['uri-part', mappedCreateDetails])
          expect(mapRisk.mock.calls).toHaveLength(1)
          expect(mapRisk.mock.calls[0]).toEqual([risk])

          // And the risk is persisted to the repo
          expect(createRepo).toHaveBeenCalledTimes(1)
          expect(createRepo.mock.calls[0]).toEqual([risk])
        })
      })
      describe('When the URI part is invalid', () => {
        test('Then an error is returned', async () => {
          let riskResult = await interactor.createRisk({ ...request, uriPart: '' })
          assertResultError(riskResult)
          assertResultError(riskResult)
          expect(riskResult.message).toBe("Invalid URI part: ''")

          riskResult = await interactor.createRisk({ ...request, uriPart: ' ' })
          assertResultError(riskResult)
          expect(riskResult.message).toBe("Invalid URI part: ' '")

          riskResult = await interactor.createRisk({ ...request, uriPart: '^' })
          assertResultError(riskResult)
          expect(riskResult.message).toBe("Invalid URI part: '^'")

          riskResult = await interactor.createRisk({ ...request, uriPart: '/start-with-slash' })
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
          const riskResult = await interactor.createRisk({ ...request })
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
          const riskResult = await interactor.createRisk({ ...request })
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
          const riskResult = await interactor.createRisk({ ...request })
          assertResultError(riskResult)
          expect(riskResult.message).toBe('create repo error')
        })
      })
    })
    describe('Given an interactor and CreateRiskRequest without optional details', () => {
      let createRepo: jest.MockedFunction<CreateRiskRepo['createRisk']>

      let mapCreateDetails: jest.MockedFunction<RiskMapper['createDetails']>
      let mapRisk: jest.MockedFunction<RiskMapper['risk']>
      let mappedCreateDetails: CreateDetailsDomain
      let mappedRisk: Risk

      let newRiskMock: jest.MockedFunction<typeof newRisk>
      let risk: RiskDomain

      let interactor: CreateRiskInteractor
      let request: CreateRiskRequest

      beforeEach(() => {
        // Repos
        createRepo = jest.fn()
        createRepo.mockImplementation(async () =>
          Promise.resolve({
            value: undefined,
            ok: true,
          } as Result<undefined>),
        )

        // Mapper
        mapCreateDetails = jest.fn()
        mapRisk = jest.fn()
        mappedCreateDetails = {
          category: CategoryTopLevelDomain.Health,
          impact: ImpactDomain.High,
          likelihood: LikelihoodDomain.High,
          name: 'name',
          type: RiskTypeDomain.Condition,
          shortDescription: 'short description',
          updated: new Date(),
        }
        mappedRisk = {
          category: 'Health',
          id: 'uri-part',
          impact: 'High',
          likelihood: 'High',
          name: 'name',
          type: 'Condition',
          shortDescription: 'short description',
          updated: new Date(),
        }

        // Factory
        risk = {
          id: 'uri-part',
          category: CategoryTopLevelDomain.Health,
          impact: ImpactDomain.High,
          likelihood: LikelihoodDomain.High,
          name: 'name',
          type: RiskTypeDomain.Condition,
          shortDescription: 'short description',
          updated: new Date(),
        }
        newRiskMock = newRisk as jest.MockedFunction<typeof newRisk>
        newRiskMock.mockImplementation(
          () =>
            ({
              value: risk,
              ok: true,
            } as Result<RiskDomain>),
        )

        // Interactor and request
        interactor = new CreateRiskInteractor(
          {
            createRisk: createRepo,
            fetchRisk: mockThrows('Unexpected fetchRisk call'),
          },
          {
            createDetails: mapCreateDetails.mockReturnValueOnce(mappedCreateDetails),
            risk: mapRisk.mockReturnValueOnce(mappedRisk),
            risks: mockThrows('Unexpected risks call'),
          },
        )
        request = {
          category: 'Health',
          impact: 'High',
          likelihood: 'High',
          name: 'name',
          type: 'Condition',
          uriPart: 'uri-part-1',
          shortDescription: 'parent short description',
          updated: new Date(),
        }
      })
      describe('When everything suceeds', () => {
        test('Then the expected result is returned', async () => {
          const riskResult = await interactor.createRisk(request)
          assertResultOk(riskResult)
          expect(riskResult.value).toBe(mappedRisk)

          // And the risk is constructed as expected
          expect(mapCreateDetails.mock.calls).toHaveLength(1)
          expect(mapCreateDetails.mock.calls[0]).toEqual([request])
          expect(newRiskMock).toHaveBeenCalledTimes(1)
          expect(newRiskMock.mock.calls[0]).toEqual(['uri-part-1', mappedCreateDetails])
          expect(mapRisk.mock.calls).toHaveLength(1)
          expect(mapRisk.mock.calls[0]).toEqual([risk])

          // And the risk is persisted to the repo
          expect(createRepo).toHaveBeenCalledTimes(1)
          expect(createRepo.mock.calls[0]).toEqual([risk])
        })
      })
    })
  })
})
