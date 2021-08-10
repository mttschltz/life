import { Risk as UsecaseRisk, RiskMapper } from '@life/usecase'
import { Category, Impact, Likelihood, Risk, RiskType } from '@life'
import { Result } from '@util'
import { RiskRepo } from '@life/repo'

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
      return Result.error(`Invalid URI part: '${uriPart}'`)
    }

    let parent
    if (parentId) {
      const parentResult = await this.#repo.fetchRisk(parentId)
      if (!parentResult.isSuccess()) {
        return parentResult
      }
      parent = parentResult.getValue()
    }

    const riskResult = Risk.create(uriPart, {
      category,
      impact,
      likelihood,
      name,
      notes,
      type,
      parent,
    })
    if (!riskResult.isSuccess()) {
      return riskResult
    }
    const risk = riskResult.getValue()

    const persistResult = await this.#repo.createRisk(risk)
    if (!persistResult.isSuccess()) {
      return Result.errorFrom(persistResult)
    }

    return Result.success(this.#mapper.risk(risk))
  }
}

export { CreateRiskInteractor, CreateRiskRequest, CreateRiskRepo }
