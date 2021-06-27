import { Result } from '@util/result'
import { Risk } from '@life/risk'
import { CreateRiskRepo } from '@life/usecase/createRisk'

export class Repo implements CreateRiskRepo {
  #jsonRepo: any

  constructor(jsonRepo: any) {
    this.#jsonRepo = jsonRepo
  }

  fetchRisk(id: string): Result<Risk> {
    return Result.error('Not implemented')
  }
}
