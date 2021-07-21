import { Category, Impact, Likelihood, Risk as RiskEntity, RiskType } from '@life'

export interface Risk {
  id: string

  category: Category
  impact: Impact
  likelihood: Likelihood

  name: string
  notes?: string
  parent?: Risk
  type: RiskType
}

export const mapRiskToUsecase = ({ id, category, impact, likelihood, name, notes, parent, type }: RiskEntity): Risk => {
  let usecaseParent
  if (parent) {
    usecaseParent = mapRiskToUsecase(parent)
  }
  return {
    id,
    category,
    impact,
    likelihood,
    name,
    notes,
    parent: usecaseParent,
    type,
  }
}
