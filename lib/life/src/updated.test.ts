import { assertResultOk } from '@helper/testing'
import { newCategory } from './category'
import { CategoryTopLevel, Impact, Likelihood, newRisk, RiskType } from './risk'
import { isUpdatedCategory, isUpdatedRisk } from './updated'

describe('domain>updated', () => {
  describe('isUpdatedCategory', () => {
    describe('Given a Category', () => {
      test('Then it returns true', () => {
        const category = newCategory('id', {
          name: 'name',
          children: [],
          path: 'path',
          shortDescription: 'short description',
          updated: new Date(),
          description: 'description',
          parent: {
            id: 'id',
            name: 'name',
            children: [],
            path: 'path',
            shortDescription: 'short description',
            updated: new Date(),
            description: 'description',
          },
        })
        assertResultOk(category)
        expect(isUpdatedCategory(category.value)).toBe(true)
      })
    })
    describe('Given a Risk', () => {
      test('Then it returns false', () => {
        const risk = newRisk('id', {
          name: 'name',
          shortDescription: 'short description',
          updated: new Date(),
          category: CategoryTopLevel.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          type: RiskType.Condition,
        })
        assertResultOk(risk)
        expect(isUpdatedCategory(risk.value)).toBe(false)
      })
    })
  })
  describe('isUpdatedRisk', () => {
    describe('Given a Risk', () => {
      test('Then it returns true', () => {
        const risk = newRisk('id', {
          name: 'name',
          shortDescription: 'short description',
          updated: new Date(),
          category: CategoryTopLevel.Health,
          impact: Impact.High,
          likelihood: Likelihood.High,
          type: RiskType.Condition,
        })
        assertResultOk(risk)
        expect(isUpdatedRisk(risk.value)).toBe(true)
      })
    })
    describe('Given a Category', () => {
      test('Then it returns false', () => {
        const category = newCategory('id', {
          name: 'name',
          children: [],
          path: 'path',
          shortDescription: 'short description',
          updated: new Date(),
          description: 'description',
          parent: {
            id: 'id',
            name: 'name',
            children: [],
            path: 'path',
            shortDescription: 'short description',
            updated: new Date(),
            description: 'description',
          },
        })
        assertResultOk(category)
        expect(isUpdatedRisk(category.value)).toBe(false)
      })
    })
  })
})
