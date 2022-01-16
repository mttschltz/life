import { Risk, RiskMapper } from '@life/usecase/mapper'
import { CategoryTopLevel as CategoryTopLevelDomain } from '@life/risk'
import { Results, resultsOk } from '@util/result'
import { RiskRepo } from '@life/repo'

type ListRepo = Pick<RiskRepo, 'list'>

// ignore code coverage for risks until they are refactored
/* c8 ignore start */
interface ListCriteria {
  category?: 'health' | 'security' | 'wealth'
  includeDescendents?: boolean
}

class ListInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: ListRepo
  #mapper: RiskMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: ListRepo, mapper: RiskMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  public async list(criteria: ListCriteria): Promise<Results<Risk>> {
    let category
    switch (criteria.category) {
      case 'health':
        category = CategoryTopLevelDomain.Health
        break
      case 'wealth':
        category = CategoryTopLevelDomain.Wealth
        break
      case 'security':
        category = CategoryTopLevelDomain.Security
        break
    }
    const risksResults = await this.#repo.list(category, !!criteria.includeDescendents)
    if (risksResults.firstErrorResult) {
      return risksResults
    }

    return resultsOk(risksResults.okValues.map((risk) => this.#mapper.risk(risk)))
  }
}
/* c8 ignore stop */

export { ListInteractor }
export type { ListCriteria }
