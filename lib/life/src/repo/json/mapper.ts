import { Risk, newRisk } from '@life/risk'
import { Result } from '@util/result'

type RiskJson = Omit<Risk, 'mitigations' | 'parent'> & { parentId?: string }

class RiskMapper {
  public toJson({ category, id, impact, likelihood, name, notes, parent, type }: Risk): RiskJson {
    return {
      category,
      id,
      impact,
      likelihood,
      name,
      notes,
      type,
      parentId: parent?.id,
    }
  }

  public fromJson(
    { id, category, impact, likelihood, name, notes, type }: RiskJson,
    parent: Risk | undefined,
  ): Result<Risk> {
    const createDetails = {
      category,
      impact,
      likelihood,
      name,
      notes,
      type,
      parent,
    }
    return newRisk(id, createDetails)
  }
}

export type { RiskJson }
export { RiskMapper }
