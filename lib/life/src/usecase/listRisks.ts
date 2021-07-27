import { mapRiskToUsecase, Risk as UsecaseRisk } from '@life/usecase'
import { Category, Risk } from '@life'
import { Result } from '@util'

export interface ListRisksRepo {
  listRisks(category: Category | undefined, includeDescendents: boolean): Result<Risk[]>
}

export interface ListRisksCriteria {
  category?: 'health' | 'wealth' | 'security'
  includeDescendents?: boolean
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
    const risksResult = this.#repo.listRisks(category, !!criteria.includeDescendents)
    if (!risksResult.isSuccess) {
      return risksResult
    }

    return Result.success(risksResult.getValue().map(mapRiskToUsecase))
  }
}
