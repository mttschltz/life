import { Risk as UsecaseRisk } from '@life/usecase/usecaseType'
import { Category, Impact, Likelihood, Risk, RiskType } from '@life/risk'

export const createRisk = (): UsecaseRisk => {
  // TODO:

  // Given a request with:
  // uri-part
  // risk details:
  // - name
  // - category
  // - impact
  // - likelihood
  // - notes
  // - type
  // - optional: parent
  // Where each item is valid // actually this should probably be handled by the domain?! except maybe existence of parent... since that's a repo concern
  // TODO: Continue

  const riskResult = Risk.create({
    category: Category.Health,
    impact: Impact.High,
    likelihood: Likelihood.High,
    name: 'name',
    notes: '',
    type: RiskType.Condition,
    parent: undefined,
  })

  if (!riskResult.isSuccess) {
    throw new Error('Error creating risk')
  }

  // const risk = riskResult.getValue()
  // TODO: Mapping function
  //
  return {
    id: 'id',
    category: Category.Health,
    impact: Impact.High,
    likelihood: Likelihood.High,
    name: 'name',
    mitigations: [],
    notes: '',
    type: RiskType.Condition,
    parent: undefined,
  }
}
