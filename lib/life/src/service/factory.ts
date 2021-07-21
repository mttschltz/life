import { Json, JsonRepo } from '@life/repo/json'
import { ListRisksInteractor } from '@life/usecase'

export class ServiceFactory {
  #jsonRepo: JsonRepo

  constructor(json: Partial<Json>) {
    this.#jsonRepo = new JsonRepo(json)
  }

  listRisksInteractor(): ListRisksInteractor {
    return new ListRisksInteractor(this.#jsonRepo)
  }
}
