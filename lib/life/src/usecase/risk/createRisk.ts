import { newRisk } from '@life/risk'
import { Risk, RiskMapper, CategoryTopLevel, Impact, Likelihood, RiskType } from '@life/usecase/mapper'
import { Result, resultError, resultOk } from '@helper/result'
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

  public async createRisk(request: CreateRiskRequest): Promise<Result<Risk>> {
    if (!request.uriPart || !/^[a-z\d]+[a-z-\d]+[a-z\d]+$/.test(request.uriPart)) {
      return resultError(`Invalid URI part: '${request.uriPart}'`)
    }

    let parent
    if (request.parentId) {
      const parentResult = await this.#repo.fetchRisk(request.parentId)
      if (!parentResult.ok) {
        return parentResult
      }
      parent = parentResult.value
    }

    const createDetails = this.#mapper.createDetails({ ...request, parent })
    const riskResult = newRisk(request.uriPart, createDetails)
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
