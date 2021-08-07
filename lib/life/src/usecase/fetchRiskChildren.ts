import { RiskMapper, Risk as UsecaseRisk } from '@life/usecase'
import { Result } from '@util'
import { RiskRepo } from '@life/repo'

type FetchRiskChildrenRepo = Pick<RiskRepo, 'fetchRiskChildren'>

class FetchRiskChildrenInteractor {
  #repo: FetchRiskChildrenRepo
  #mapper: RiskMapper

  constructor(repo: FetchRiskChildrenRepo, mapper: RiskMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  async fetchRiskChildren(id: string): Promise<Result<UsecaseRisk[]>> {
    const riskChildrenResult = await this.#repo.fetchRiskChildren(id)
    if (!riskChildrenResult.isSuccess()) {
      return riskChildrenResult
    }

    return Result.success(this.#mapper.risks(riskChildrenResult.getValue()))
  }
}

export { FetchRiskChildrenInteractor }
