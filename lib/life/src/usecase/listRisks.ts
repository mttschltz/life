import { mapRiskToUsecase, Risk as UsecaseRisk } from 'life/src/usecase'
import { Category, Risk } from 'life/src'
import { Result } from '@util'

export interface ListRisksRepo {
  listRisks(category: Category | undefined): Result<Risk[]>
}

export interface ListRisksCriteria {
  category?: 'health' | 'wealth' | 'security'
}

export class ListRisksInteractor {
  #repo: ListRisksRepo

  constructor(repo: ListRisksRepo) {
    this.#repo = repo
  }

  listRisks(criteria: ListRisksCriteria): Result<UsecaseRisk[]> {
    let category
    switch (criteria.category) {
      case 'health':
        category = Category.Health
        break
      case 'wealth':
        category = Category.Wealth
        break
      case 'security':
        category = Category.Security
        break
    }
    const risksResult = this.#repo.listRisks(category)
    if (!risksResult.isSuccess) {
      return risksResult
    }

    return Result.success(risksResult.getValue().map(mapRiskToUsecase))
  }
}
