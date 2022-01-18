// ignore code coverage for risks until they are refactored
/* istanbul ignore file */
import { RiskMapper, Risk } from '@life/usecase/mapper'
import { Result, resultOk } from '@util/result'
import { RiskRepo } from '@life/repo'

type FetchRiskParentRepo = Pick<RiskRepo, 'fetchRiskParent'>

class FetchRiskParentInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: FetchRiskParentRepo
  #mapper: RiskMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: FetchRiskParentRepo, mapper: RiskMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  public async fetchRiskParent(id: string): Promise<Result<Risk | undefined>> {
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
