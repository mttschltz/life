import { mapRiskToUsecase, Risk as UsecaseRisk } from 'life/src/usecase'
import { Risk } from 'life/src'
import { Result } from 'lib/util'

export interface ListRisksRepo {
  listRisks: () => Result<Risk[]>
}

export class ListRisksInteractor {
  #repo: ListRisksRepo

  constructor(repo: ListRisksRepo) {
    this.#repo = repo
  }

  listRisks(): Result<UsecaseRisk[]> {
    // TODO:
    // get list using repo
    // fetch parents
    const risksResult = this.#repo.listRisks()
    if (!risksResult.isSuccess) {
      return risksResult
    }

    return Result.success(risksResult.getValue().map(mapRiskToUsecase))
  }
}
