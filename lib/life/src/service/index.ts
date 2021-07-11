import { Repo } from 'life/src/repo'
import { Result } from '@util'
import { CreateRiskInteractor, CreateRiskRequest } from 'life/src/usecase'
import { Risk } from 'life/src/usecase'
import { JsonRepo } from 'life/src/repo/json'

// // TODO:
// // In theory, a handler might look like this:
// {
//   interactors

//   constructor(interactors){
//     this.interactors
//   }

//   createRisk(request): respose {
//     const result = this.#interactors.newCreateRiskInteractor().CreateRisk(parsedInfo)
//   }
//   listRisks(request): response{
//     const result = this.#interactors.newCreateRiskInteractor().CreateRisk(parsedInfo)
//   }
// }

// // in theory, service factory may look like this:
// {

//   constructor() {
//     this.db = db
//   }

//   newCreateRiskInteractor() {
//     riskRepo = repo.NewRiskRepo(this.db)
//     return new CreateRiskUsecase(riskRepo)
//   }
// }

// // Then 'main' would
// const service = new Service(db)
// const handler = new Handler(service)
// handler.createRisk()

// But also... is this all irrelevant if I can use graphql?!?!!??!?!?!!!!?!??!??!?

// Reminder... main thing is being decoupled and being able to mock....
// as long as usecases and domain aren't incorrectly coupled... how the service/handlers
// are done may not matter much
export class Service {
  #jsonRepo: Repo

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
