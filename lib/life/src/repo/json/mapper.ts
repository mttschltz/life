import { Risk } from '@life'
import { Result } from '@util'

type RiskJson = Omit<Risk, 'parent' | 'mitigations'> & { parentId?: string }

class RiskMapper {
  toJson({ category, id, impact, likelihood, name, notes, parent, type }: Risk): RiskJson {
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

  fromJson({ id, category, impact, likelihood, name, notes, type }: RiskJson, parent: Risk | undefined): Result<Risk> {
    const createDetails = {
      category,
      impact,
      likelihood,
      name,
      notes,
      type,
      parent,
    }
    return Risk.create(id, createDetails)
  }
}

export { RiskMapper, RiskJson }
