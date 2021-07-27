import { Category, Impact, Likelihood, Risk, RiskType } from '@life'
import { describe, expect, test } from '@jest/globals'

describe('empty', () => {
  test('test', () => {
    const risk = Risk.create('id', {
      category: Category.Health,
      impact: Impact.High,
      likelihood: Likelihood.High,
      name: 'name',
      notes: 'notes',
      parent: undefined,
      type: RiskType.Condition,
    })
    expect(risk.isSuccess()).toEqual(true)
  })
})
