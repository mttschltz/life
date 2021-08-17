import { Risk as UsecaseRisk, RiskMapper } from '@life/usecase'
import { Category, Impact, Likelihood, RiskType } from '@life'
import { Result, resultError, resultOk } from '@util'
import { RiskRepo } from '@life/repo'
import { newRisk } from '@life/risk'

interface CreateRiskRequest {
  uriPart: string
  name: string
  category: Category
  impact: Impact
  likelihood: Likelihood
  notes?: string
  type: RiskType
  parentId?: string
}

type CreateRiskRepo = Pick<RiskRepo, 'createRisk' | 'fetchRisk'>

class CreateRiskInteractor {
  #repo: CreateRiskRepo
  #mapper: RiskMapper

  constructor(repo: CreateRiskRepo, mapper: RiskMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  async createRisk({
    uriPart,
    type,
    parentId,
    name,
    likelihood,
    impact,
    category,
    notes,
  }: CreateRiskRequest): Promise<Result<UsecaseRisk>> {
    if (!uriPart || !/^[a-z]+[a-z-]+[a-z]+$/.test(uriPart)) {
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

export { CreateRiskInteractor, CreateRiskRequest, CreateRiskRepo }
