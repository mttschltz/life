import { Result } from '@util'
import { Risk } from '@life'
import { CreateRiskRepo } from '@life/usecase'

export class Repo implements CreateRiskRepo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #jsonRepo: any

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  constructor(jsonRepo: any) {
    this.#jsonRepo = jsonRepo
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchRisk(id: string): Result<Risk> {
    return Result.error('Not implemented' + this.#jsonRepo + id)
  }
}
