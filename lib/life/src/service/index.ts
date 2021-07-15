import { Result } from '@util'
import { CreateRiskInteractor, CreateRiskRequest } from 'life/src/usecase'
import { Risk } from 'life/src/usecase'
import { JsonRepo } from 'life/src/repo/json'

export class Service {
  #jsonRepo: JsonRepo

  constructor() {
    this.#jsonRepo = new JsonRepo({})
  }

  createRisk(request: CreateRiskRequest): Result<Risk> {
    // TODO: Check to see if Repo and CreateRiskInteractor are
    // mockable with Jest https://jestjs.io/docs/es6-class-mocks
    const createRisk = new CreateRiskInteractor(this.#jsonRepo)
    return createRisk.createRisk(request)
  }

  listRisks(): Result<Risk[]> {
    // TODO:
    return Result.success()
  }
}
