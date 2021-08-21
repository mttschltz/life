import { newRisk, Category, Impact, Likelihood, RiskType } from '@life/risk'
import type { CreateDetails } from '@life/risk'
import { describe, expect, test } from '@jest/globals'
import { assertResultError, assertResultOk } from '@util/testing'

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
        const riskResult = newRisk('id', {
          ...createDetails,
          notes: undefined,
        })
        assertResultOk(riskResult)

        const risk = riskResult.value
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
        const riskResult = newRisk('id', createDetails)
        assertResultOk(riskResult)

        const risk = riskResult.value
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
        const parentRiskResult = newRisk('parentId', parentCreateDetails)
        assertResultOk(parentRiskResult)

        // Create risk
        const riskResult = newRisk('id', {
          ...createDetails,
          parent: parentRiskResult.value,
        })
        assertResultOk(riskResult)

        // Validate parent risk
        const risk = riskResult.value
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
        expect(() => newRisk('id', undefined)).toThrow()

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const riskResult = newRisk('id', {})
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('category must be a valid enum value')
      })
    })
    describe('Given an invalid id', () => {
      test('Then an error result is returned', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        let riskResult = newRisk(undefined, createDetails)
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('id must be a string')

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        riskResult = newRisk('', createDetails)
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('id must be longer than or equal to 1 characters')

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        riskResult = newRisk(5, createDetails)
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('id must be a string')
      })
    })
    describe('Given an invalid category', () => {
      test('Then an error result is returned', () => {
        let riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          category: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('category must be a valid enum value')

        riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          category: 'invalid category',
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('category must be a valid enum value')
      })
    })
    describe('Given an invalid impact', () => {
      test('Then an error result is returned', () => {
        let riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          impact: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('impact must be a valid enum value')

        riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          impact: 'invalid impact',
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('impact must be a valid enum value')
      })
    })
    describe('Given an invalid likelihood', () => {
      test('Then an error result is returned', () => {
        let riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          likelihood: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('likelihood must be a valid enum value')

        riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          likelihood: 'invalid likelihood',
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('likelihood must be a valid enum value')
      })
    })
    describe('Given an invalid name', () => {
      test('Then an error result is returned', () => {
        let riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          name: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('name must be a string')

        riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          name: 'x',
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('name must be longer than or equal to 2 characters')
      })
    })
    describe('Given an invalid notes', () => {
      test('Then an error result is returned', () => {
        const riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          notes: 5,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('notes must be a string')
      })
    })
    describe('Given an invalid parent', () => {
      test('Then an error result is returned', () => {
        const riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          parent: 'parent',
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('parent must be instance of Risk')
      })
    })
    describe('Given an invalid risk type', () => {
      test('Then an error result is returned', () => {
        let riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('type must be a valid enum value')

        riskResult = newRisk('id', {
          ...createDetails,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type: 'x',
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('type must be a valid enum value')
      })
    })
    describe('Given a CreateDetails with multiple missing fields', () => {
      test('Then an error result with the first error is returned', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const riskResult = newRisk('id', {})
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('category must be a valid enum value')
      })
    })
  })
})
