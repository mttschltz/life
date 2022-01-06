import { newRisk, CategoryTopLevel, Impact, Likelihood, RiskType } from '@life/risk'
import { Risk as UsecaseRisk, RiskMapper } from '@life/usecase/mapper'
import { Result, resultError, resultOk } from '@util/result'
import { RiskRepo } from '@life/repo'

interface CreateRiskRequest {
  uriPart: string
  name: string
  category: CategoryTopLevel
  impact: Impact
  likelihood: Likelihood
  notes?: string
  type: RiskType
  parentId?: string
  shortDescription: string
  updated: Date
}

type CreateRiskRepo = Pick<RiskRepo, 'createRisk' | 'fetchRisk'>

class CreateRiskInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: CreateRiskRepo
  #mapper: RiskMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: CreateRiskRepo, mapper: RiskMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  public async createRisk({
    uriPart,
    type,
    parentId,
    name,
    likelihood,
    impact,
    category,
    notes,
    shortDescription,
    updated,
  }: CreateRiskRequest): Promise<Result<UsecaseRisk>> {
    if (!uriPart || !/^[a-z\d]+[a-z-\d]+[a-z\d]+$/.test(uriPart)) {
      return resultError(`Invalid URI part: '${uriPart}'`)
    }

    let parent
    if (parentId) {
      const parentResult = await this.#repo.fetchRisk(parentId)
      if (!parentResult.ok) {
        return parentResult
      }
      parent = parentResult.value
    }

    const riskResult = newRisk(uriPart, {
      category,
      impact,
      likelihood,
      name,
      notes,
      type,
      parent,
      shortDescription,
      updated,
    })
    if (!riskResult.ok) {
      return riskResult
    }
    const risk = riskResult.value

    const persistResult = await this.#repo.createRisk(risk)
    if (!persistResult.ok) {
      return persistResult
    }

    return resultOk(this.#mapper.risk(risk))
  }
}

export { CreateRiskInteractor }
export type { CreateRiskRequest, CreateRiskRepo }
