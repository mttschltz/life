import { RiskMapper, Risk as UsecaseRisk } from '@life/usecase'
import { Result } from '@util'
import { RiskRepo } from '@life/repo'

type FetchRiskParentRepo = Pick<RiskRepo, 'fetchRiskParent'>

class FetchRiskParentInteractor {
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

export { FetchRiskParentInteractor }
