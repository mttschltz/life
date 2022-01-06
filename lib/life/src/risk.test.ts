import { newRisk, CategoryTopLevel, Impact, Likelihood, RiskType } from '@life/risk'
import type { CreateDetails } from '@life/risk'
import { describe, expect, test } from '@jest/globals'
import { assertResultError, assertResultOk } from '@util/testing'

describe('Risk', () => {
  describe('Create', () => {
    let createDetails: CreateDetails
    let updated: Date
    beforeEach(() => {
      updated = new Date()
      createDetails = {
        category: CategoryTopLevel.Health,
        impact: Impact.High,
        likelihood: Likelihood.High,
        name: 'name',
        shortDescription: 'short description',
        notes: 'notes',
        parent: undefined,
        type: RiskType.Condition,
        updated,
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
        expect(risk.category).toEqual(CategoryTopLevel.Health)
        expect(risk.impact).toEqual(Impact.High)
        expect(risk.likelihood).toEqual(Likelihood.High)
        expect(risk.name).toEqual('name')
        expect(risk.shortDescription).toEqual('short description')
        expect(risk.notes).toBeUndefined()
        expect(risk.parent).toBeUndefined()
        expect(risk.type).toEqual(RiskType.Condition)
        expect(risk.updated).toEqual(updated)
      })
    })
    describe('Given a valid CreateDetails with optional fields but no parent', () => {
      test('Then it successfully creates a Risk', () => {
        const riskResult = newRisk('id', createDetails)
        assertResultOk(riskResult)

        const risk = riskResult.value
        expect(risk.category).toEqual(CategoryTopLevel.Health)
        expect(risk.impact).toEqual(Impact.High)
        expect(risk.likelihood).toEqual(Likelihood.High)
        expect(risk.name).toEqual('name')
        expect(risk.shortDescription).toEqual('short description')
        expect(risk.notes).toEqual('notes')
        expect(risk.parent).toBeUndefined()
        expect(risk.type).toEqual(RiskType.Condition)
        expect(risk.updated).toEqual(updated)
      })
    })
    describe('Given a valid CreateDetails with a parent', () => {
      test('Then it successfully creates a Risk with that parent', () => {
        // Create parent risk
        const parentUpdated = new Date()
        const parentCreateDetails: CreateDetails = {
          category: CategoryTopLevel.Security,
          impact: Impact.Normal,
          likelihood: Likelihood.Normal,
          name: 'parent name',
          shortDescription: 'parent short description',
          notes: 'parent notes',
          parent: undefined,
          type: RiskType.Goal,
          updated: parentUpdated,
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
        expect(risk.parent?.category).toEqual(CategoryTopLevel.Security)
        expect(risk.parent?.impact).toEqual(Impact.Normal)
        expect(risk.parent?.likelihood).toEqual(Likelihood.Normal)
        expect(risk.parent?.name).toEqual('parent name')
        expect(risk.parent?.shortDescription).toEqual('parent short description')
        expect(risk.parent?.notes).toEqual('parent notes')
        expect(risk.parent?.parent).toBeUndefined()
        expect(risk.parent?.type).toEqual(RiskType.Goal)
        expect(risk.parent?.updated).toEqual(parentUpdated)
      })
    })
    describe('Given an invalid CreateDetails', () => {
      test('Then an error result is returned', () => {
        // @ts-expect-error: In the domain we want to protect against runtime type errors
        expect(() => newRisk('id', undefined)).toThrow()

        // @ts-expect-error: In the domain we want to protect against runtime type errors
        const riskResult = newRisk('id', {})
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('category must be a valid enum value')
      })
    })
    describe('Given an invalid id', () => {
      test('Then an error result is returned', () => {
        // @ts-expect-error: In the domain we want to protect against runtime type errors
        let riskResult = newRisk(undefined, createDetails)
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('id must be a string')

        riskResult = newRisk('', createDetails)
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('id must be longer than or equal to 1 characters')

        // @ts-expect-error: In the domain we want to protect against runtime type errors
        riskResult = newRisk(5, createDetails)
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('id must be a string')
      })
    })
    describe('Given an invalid category', () => {
      test('Then an error result is returned', () => {
        let riskResult = newRisk('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          category: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('category must be a valid enum value')

        riskResult = newRisk('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
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
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          impact: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('impact must be a valid enum value')

        riskResult = newRisk('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
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
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          likelihood: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('likelihood must be a valid enum value')

        riskResult = newRisk('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
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
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          name: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('name must be a string')

        riskResult = newRisk('id', {
          ...createDetails,
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
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          notes: 5,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('notes must be a string')
      })
    })
    describe('Given a short description', () => {
      describe('When its empty', () => {
        test('Then an error result is returned', () => {
          const riskResult = newRisk('id', {
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            shortDescription: undefined,
          })
          assertResultError(riskResult)
          expect(riskResult.message).toEqual('shortDescription must be a string')
        })
      })
      describe('When its not long enough', () => {
        test('Then an error result is returned', () => {
          const riskResult = newRisk('id', {
            ...createDetails,
            shortDescription: 'x',
          })
          assertResultError(riskResult)
          expect(riskResult.message).toEqual('shortDescription must be longer than or equal to 2 characters')
        })
      })
    })
    describe('Given an invalid parent', () => {
      test('Then an error result is returned', () => {
        const riskResult = newRisk('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
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
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          type: undefined,
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('type must be a valid enum value')

        riskResult = newRisk('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          type: 'x',
        })
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('type must be a valid enum value')
      })
    })
    describe('Given an invalid updated', () => {
      describe('and updated is not provided', () => {
        test('Then an error result is returned', () => {
          const riskResult = newRisk('id', {
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            updated: undefined,
          })
          assertResultError(riskResult)
          expect(riskResult.message).toEqual('updated must be a Date instance')
        })
      })
      describe('and updated is not a Date', () => {
        test('Then an error result is returned', () => {
          const riskResult = newRisk('id', {
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            updated: '',
          })
          assertResultError(riskResult)
          expect(riskResult.message).toEqual('updated must be a Date instance')
        })
      })
    })
    describe('Given a CreateDetails with multiple missing fields', () => {
      test('Then an error result with the first error is returned', () => {
        // @ts-expect-error: In the domain we want to protect against runtime type errors
        const riskResult = newRisk('id', {})
        assertResultError(riskResult)
        expect(riskResult.message).toEqual('category must be a valid enum value')
      })
    })
  })
})
