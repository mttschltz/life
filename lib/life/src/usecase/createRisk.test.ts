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

    beforeEach(() => {
      // Repos
      fetchRisk = jest.fn()
      createRisk = jest.fn().mockImplementationOnce(() => Result.success(undefined))
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
      riskCreateFactory = jest.spyOn(Risk, 'create').mockImplementationOnce(() => factoryRisk)
    })

    describe('Given a CreateRiskRequest without optional details', () => {
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
        expect(createRisk.mock.calls[0][0]).toEqual(factoryRisk)
      })
    })
  })
})

// TODO:
// alll optional create values
// given parent found
// create success
// persist success
// map success

// no optional create details
// uri part not valid
// given parent not found
// create errror
// persist error
// map error
