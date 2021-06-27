import { Repo } from '@life/repo'
import { Result } from '@util/result'
import { CreateRiskInteractor, CreateRiskRequest } from '@life/usecase/createRisk'
import { Risk } from '@life/usecase/usecaseType'

export class Service {
  #jsonRepo: any

  constructor(jsonRepo: any) {
    this.#jsonRepo = jsonRepo
  }

  createRisk(request: CreateRiskRequest): Result<Risk> {
    // TODO: Check to see if Repo and CreateRiskInteractor are
    // mockable with Jest https://jestjs.io/docs/es6-class-mocks
    const repo = new Repo(this.#jsonRepo)
    const createRisk = new CreateRiskInteractor(repo)
    return createRisk.createRisk(request)
  }
}
