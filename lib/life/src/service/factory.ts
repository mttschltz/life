import { Json, JsonRepo } from '@life/repo/json'
import { ListRisksInteractor } from '@life/usecase'
import { FetchRiskParentInteractor } from '@life/usecase/fetchRiskParent'

export class ServiceFactory {
  #jsonRepo: JsonRepo

  constructor(json: Partial<Json>) {
    this.#jsonRepo = new JsonRepo(json)
  }

  listRisksInteractor(): ListRisksInteractor {
    return new ListRisksInteractor(this.#jsonRepo)
  }

  fetchRiskParentInteractor(): FetchRiskParentInteractor {
    return new FetchRiskParentInteractor(this.#jsonRepo)
  }
}
