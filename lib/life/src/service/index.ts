import { Result } from '@util'
import {
  CreateRiskInteractor,
  CreateRiskRequest,
  ListRisksCriteria as UsecaseListRisksCriteria,
  ListRisksInteractor,
} from 'life/src/usecase'
import { Risk } from 'life/src/usecase'
import { JsonRepo } from 'life/src/repo/json'

type ListRisksCriteria = UsecaseListRisksCriteria

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

  listRisks(criteria: ListRisksCriteria): Result<Risk[]> {
    const interactor = new ListRisksInteractor(this.#jsonRepo)
    return interactor.listRisks(criteria)
  }
}

// TODO:
// The ApolloServer needs
// resolvers
// typeDefs (.graphql)
// config
// probably to provide the empty {} for the DB
