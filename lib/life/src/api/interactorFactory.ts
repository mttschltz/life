import { Json, JsonRepo } from '@life/repo/json/service'
import { RiskMapper as JsonRiskMapper } from '@life/repo/json/mapper'
import { RiskMapper as UsecaseRiskMapper } from '@life/usecase/mapper'
import { ListRisksInteractor } from '@life/usecase/listRisks'
import { FetchRiskChildrenInteractor } from '@life/usecase/fetchRiskChildren'
import { FetchRiskParentInteractor } from '@life/usecase/fetchRiskParent'
import { CreateRiskInteractor } from '@life/usecase/createRisk'

export class InteractorFactory {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #jsonRepo: JsonRepo
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(json: Partial<Json>) {
    this.#jsonRepo = new JsonRepo(json, new JsonRiskMapper())
  }

  public listRisksInteractor(): ListRisksInteractor {
    return new ListRisksInteractor(this.#jsonRepo, new UsecaseRiskMapper())
  }

  public fetchRiskParentInteractor(): FetchRiskParentInteractor {
    return new FetchRiskParentInteractor(this.#jsonRepo, new UsecaseRiskMapper())
  }

  public fetchRiskChildrenInteractor(): FetchRiskChildrenInteractor {
    return new FetchRiskChildrenInteractor(this.#jsonRepo, new UsecaseRiskMapper())
  }

  public createRiskInteractor(): CreateRiskInteractor {
    return new CreateRiskInteractor(this.#jsonRepo, new UsecaseRiskMapper())
  }
}
