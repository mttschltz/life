import { RiskMapper, Risk as UsecaseRisk } from '@life/usecase'
import { Risk } from '@life'
import { Result } from '@util'

export interface FetchRiskParentRepo {
  fetchRiskParent(id: string): Promise<Result<Risk | undefined>>
}

export class FetchRiskParentInteractor {
  #repo: FetchRiskParentRepo
  #mapper: RiskMapper

  constructor(repo: FetchRiskParentRepo, mapper: RiskMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  async fetchRiskParent(id: string): Promise<Result<UsecaseRisk | undefined>> {
    const riskParentResult = await this.#repo.fetchRiskParent(id)
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
