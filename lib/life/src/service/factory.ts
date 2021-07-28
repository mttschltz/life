import { Json, JsonRepo } from '@life/repo/json'
import { ListRisksInteractor, RiskMapper } from '@life/usecase'
import { FetchRiskParentInteractor } from '@life/usecase/fetchRiskParent'

export class ServiceFactory {
  #jsonRepo: JsonRepo

  constructor(json: Partial<Json>) {
    this.#jsonRepo = new JsonRepo(json)
  }

  listRisksInteractor(): ListRisksInteractor {
    return new ListRisksInteractor(this.#jsonRepo, new RiskMapper())
  }

  fetchRiskParentInteractor(): FetchRiskParentInteractor {
    return new FetchRiskParentInteractor(this.#jsonRepo, new RiskMapper())
  }
}
