import { Category, Impact, Likelihood, Risk as RiskEntity, RiskType } from '@life'

interface Risk {
  id: string

  category: Category
  impact: Impact
  likelihood: Likelihood

  name: string
  notes?: string
  parent?: Risk
  type: RiskType
}

class RiskMapper {
  risk({ id, category, impact, likelihood, name, notes, parent, type }: RiskEntity): Risk {
    let usecaseParent
    if (parent) {
      usecaseParent = this.risk(parent)
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
}

export { RiskMapper, Risk }