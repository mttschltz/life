import { RiskMapper, Risk as UsecaseRisk } from '@life/usecase'
import { Risk } from '@life'
import { Result } from '@util'

export interface FetchRiskParentRepo {
  fetchRiskParent(id: string): Result<Risk | undefined>
}

export class FetchRiskParentInteractor {
  #repo: FetchRiskParentRepo
  #mapper: RiskMapper

  constructor(repo: FetchRiskParentRepo, mapper: RiskMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  fetchRiskParent(id: string): Result<UsecaseRisk | undefined> {
    const riskParentResult = this.#repo.fetchRiskParent(id)
    if (!riskParentResult.isSuccess()) {
      return riskParentResult
    }

    const riskParent = riskParentResult.getValue()
    if (!riskParent) {
      return Result.success(undefined)
    }

    return Result.success(this.#mapper.risk(riskParent))
  }
}
