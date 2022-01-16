import { RiskMapper, Risk } from '@life/usecase/mapper'
import { Result, resultOk } from '@util/result'
import { RiskRepo } from '@life/repo'

type FetchRiskChildrenRepo = Pick<RiskRepo, 'fetchRiskChildren'>

// ignore code coverage for risks until they are refactored
/* c8 ignore start */
class FetchRiskChildrenInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: FetchRiskChildrenRepo
  #mapper: RiskMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: FetchRiskChildrenRepo, mapper: RiskMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  public async fetchRiskChildren(id: string): Promise<Result<Risk[]>> {
    const riskChildrenResult = await this.#repo.fetchRiskChildren(id)
    if (!riskChildrenResult.ok) {
      return riskChildrenResult
    }

    return resultOk(this.#mapper.risks(riskChildrenResult.value))
  }
}
/* c8 ignore stop */

export { FetchRiskChildrenInteractor }
