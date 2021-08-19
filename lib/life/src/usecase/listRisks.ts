import { Risk as UsecaseRisk, RiskMapper } from '@life/usecase/mapper'
import { Category } from '@life/risk'
import { Result, resultOk } from '@util/result'
import { RiskRepo } from '@life/repo'

type ListRisksRepo = Pick<RiskRepo, 'listRisks'>

interface ListRisksCriteria {
  category?: 'health' | 'wealth' | 'security'
  includeDescendents?: boolean
}

class ListRisksInteractor {
  #repo: ListRisksRepo
  #mapper: RiskMapper

  constructor(repo: ListRisksRepo, mapper: RiskMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  async listRisks(criteria: ListRisksCriteria): Promise<Result<UsecaseRisk[]>> {
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
    const risksResult = await this.#repo.listRisks(category, !!criteria.includeDescendents)
    if (!risksResult.ok) {
      return risksResult
    }

    return resultOk(risksResult.value.map((risk) => this.#mapper.risk(risk)))
  }
}

export { ListRisksInteractor }
export type { ListRisksCriteria }
