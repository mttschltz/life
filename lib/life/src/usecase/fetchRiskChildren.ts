import { RiskMapper, Risk as UsecaseRisk } from '@life/usecase/mapper'
import { Result, resultOk } from '@util/result'
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
    if (!riskChildrenResult.ok) {
      return riskChildrenResult
    }

    return resultOk(this.#mapper.risks(riskChildrenResult.value))
  }
}

export { FetchRiskChildrenInteractor }
