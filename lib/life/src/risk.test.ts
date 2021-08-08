import { Category, CreateDetails, Impact, Likelihood, Risk, RiskType } from '@life'
import { describe, expect, test } from '@jest/globals'

describe('Risk', () => {
  describe('Create', () => {
    let createDetails: CreateDetails
    beforeEach(() => {
      createDetails = {
        category: Category.Health,
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'name',
        notes: 'notes',
        parent: undefined,
        type: RiskType.Condition,
      }
    })

    describe('Given a valid CreateDetails without optional fields', () => {
      test('Then it successfully creates a Risk', () => {
        const riskResult = Risk.create('id', {
          ...createDetails,
          notes: undefined,
        })
        expect(riskResult.isSuccess()).toEqual(true)

        const risk = riskResult.getValue()
        expect(risk.category).toEqual(Category.Health)
        expect(risk.impact).toEqual(Impact.High)
        expect(risk.likelihood).toEqual(Likelihood.High)
        expect(risk.name).toEqual('name')
        expect(risk.notes).toBeUndefined()
        expect(risk.parent).toBeUndefined()
        expect(risk.type).toEqual(RiskType.Condition)
      })
    })
    describe('Given a valid CreateDetails with optional fields but no parent', () => {
      test('Then it successfully creates a Risk', () => {
        const riskResult = Risk.create('id', createDetails)
        expect(riskResult.isSuccess()).toEqual(true)

        const risk = riskResult.getValue()
        expect(risk.category).toEqual(Category.Health)
        expect(risk.impact).toEqual(Impact.High)
        expect(risk.likelihood).toEqual(Likelihood.High)
        expect(risk.name).toEqual('name')
        expect(risk.notes).toEqual('notes')
        expect(risk.parent).toBeUndefined()
        expect(risk.type).toEqual(RiskType.Condition)
      })
    })
    describe('Given a valid CreateDetails with a parent', () => {
      test('Then it successfully creates a Risk with that parent', () => {
        // Create parent risk
        const parentCreateDetails: CreateDetails = {
          category: Category.Security,
          impact: Impact.Normal,
          likelihood: Likelihood.Normal,
          name: 'parent name',
          notes: 'parent notes',
          parent: undefined,
          type: RiskType.Goal,
        }
        const parentRiskResult = Risk.create('parentId', parentCreateDetails)
        expect(parentRiskResult.isSuccess()).toEqual(true)

        // Create risk
        const riskResult = Risk.create('id', {
          ...createDetails,
          parent: parentRiskResult.getValue(),
        })
        expect(riskResult.isSuccess()).toEqual(true)

        // Validate parent risk
        const risk = riskResult.getValue()
        expect(risk.parent).not.toBeUndefined()
        expect(risk.parent?.category).toEqual(Category.Security)
        expect(risk.parent?.impact).toEqual(Impact.Normal)
        expect(risk.parent?.likelihood).toEqual(Likelihood.Normal)
        expect(risk.parent?.name).toEqual('parent name')
        expect(risk.parent?.notes).toEqual('parent notes')
        expect(risk.parent?.parent).toBeUndefined()
        expect(risk.parent?.type).toEqual(RiskType.Goal)
      })
    })
    describe('Given an invalid CreateDetails', () => {
      test('Then an error result is returned', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const riskResult = Risk.create('id', undefined)
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('Missing details')
      })
    })
    describe('Given an invalid id', () => {
      test('Then an error result is returned', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        let riskResult = Risk.create(undefined, createDetails)
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('id must be a string')

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        riskResult = Risk.create('', createDetails)
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('id must be longer than or equal to 1 characters')

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        riskResult = Risk.create(5, createDetails)
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('id must be a string')
      })
    })
    describe('Given an invalid category', () => {
      test('Then an error result is returned', () => {
        let riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          category: undefined,
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('category must be a valid enum value')

        riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          category: 'invalid category',
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('category must be a valid enum value')
      })
    })
    describe('Given an invalid impact', () => {
      test('Then an error result is returned', () => {
        let riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          impact: undefined,
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('impact must be a valid enum value')

        riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          impact: 'invalid impact',
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('impact must be a valid enum value')
      })
    })
    describe('Given an invalid likelihood', () => {
      test('Then an error result is returned', () => {
        let riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          likelihood: undefined,
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('likelihood must be a valid enum value')

        riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          likelihood: 'invalid likelihood',
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('likelihood must be a valid enum value')
      })
    })
    describe('Given an invalid name', () => {
      test('Then an error result is returned', () => {
        let riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          name: undefined,
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('name must be a string')

        riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          name: 'x',
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('name must be longer than or equal to 2 characters')
      })
    })
    describe('Given an invalid notes', () => {
      test('Then an error result is returned', () => {
        const riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          notes: 5,
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('notes must be a string')
      })
    })
    describe('Given an invalid parent', () => {
      test('Then an error result is returned', () => {
        const riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          parent: 'parent',
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('parent must be instance of Risk')
      })
    })
    describe('Given an invalid risk type', () => {
      test('Then an error result is returned', () => {
        let riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type: undefined,
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('type must be a valid enum value')

        riskResult = Risk.create('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type: 'x',
        })
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('type must be a valid enum value')
      })
    })
    describe('Given a CreateDetails with multiple missing fields', () => {
      test('Then an error result with the first error is returned', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const riskResult = Risk.create('id', {})
        expect(riskResult.isSuccess()).toEqual(false)
        expect(riskResult.getErrorMessage()).toEqual('category must be a valid enum value')
      })
    })
  })
})
