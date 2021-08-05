import { Json, JsonRepo } from '@life/repo/json'
import { RiskMapper as JsonRiskMapper } from '@life/repo/json/mapper'
import { CreateRiskInteractor, ListRisksInteractor, RiskMapper as UsecaseRiskMapper } from '@life/usecase'
import { FetchRiskChildrenInteractor } from '@life/usecase/fetchRiskChildren'
import { FetchRiskParentInteractor } from '@life/usecase/fetchRiskParent'

export class ServiceFactory {
  #jsonRepo: JsonRepo

  constructor(json: Partial<Json>) {
    this.#jsonRepo = new JsonRepo(json, new JsonRiskMapper())
  }

  listRisksInteractor(): ListRisksInteractor {
    return new ListRisksInteractor(this.#jsonRepo, new UsecaseRiskMapper())
  }

  fetchRiskParentInteractor(): FetchRiskParentInteractor {
    return new FetchRiskParentInteractor(this.#jsonRepo, new UsecaseRiskMapper())
  }

  fetchRiskChildrenInteractor(): FetchRiskChildrenInteractor {
    return new FetchRiskChildrenInteractor(this.#jsonRepo, new UsecaseRiskMapper())
  }

  createRiskInteractor(): CreateRiskInteractor {
    return new CreateRiskInteractor(this.#jsonRepo, new UsecaseRiskMapper())
  }
}
