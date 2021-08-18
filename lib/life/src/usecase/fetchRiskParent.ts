import { RiskMapper, Risk as UsecaseRisk } from '@life/usecase/mapper'
import { Result, resultOk } from '@util/result'
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
    if (!riskParentResult.ok) {
      return riskParentResult
    }

    const riskParent = riskParentResult.value
    if (!riskParent) {
      return resultOk(undefined)
    }

    return resultOk(this.#mapper.risk(riskParent))
  }
}

export { FetchRiskParentInteractor }
