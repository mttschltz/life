import { Repo } from '@life/repo'
import { Result } from '@util'
import { CreateRiskInteractor, CreateRiskRequest } from '@life/usecase'
import { Risk } from '@life/usecase'

export class Service {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #jsonRepo: any

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
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
