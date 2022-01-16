// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Results, resultsOk } from '@util/result'
import { UpdatedRepo as UpdatedRepoDomain } from '@life/repo'
import { Updated } from '@life/updated'
import { RiskRepoJson } from './risk'
import { CategoryRepoJson } from './category'

type UpdatedRepoJson = UpdatedRepoDomain

function newUpdatedRepoJson(categoryRepo: CategoryRepoJson, riskRepo: RiskRepoJson): UpdatedRepoJson {
  return new UpdatedRepoJsonImpl(categoryRepo, riskRepo)
}

class UpdatedRepoJsonImpl implements UpdatedRepoJson {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #categoryRepo: CategoryRepoJson
  #riskRepo: RiskRepoJson
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(categoryRepo: CategoryRepoJson, riskRepo: RiskRepoJson) {
    this.#categoryRepo = categoryRepo
    this.#riskRepo = riskRepo
  }

  public async list(criteria: { count: number }): Promise<Results<Updated>> {
    // Get all categories by date
    const categoriesResults = await this.#categoryRepo.list({ onlyRoot: true })
    if (categoriesResults.firstErrorResult) {
      return categoriesResults.withOnlyFirstError()
    }
    const categories = categoriesResults.okValues
    categories.sort((c1, c2) => c2.updated.getTime() - c1.updated.getTime())

    // Get all risks by date
    const risksResults = await this.#riskRepo.list(undefined, true)
    if (risksResults.firstErrorResult) {
      return risksResults.withOnlyFirstError()
    }
    const risks = risksResults.okValues
    risks.sort((r1, r2) => r2.updated.getTime() - r1.updated.getTime())

    // Merge list
    const updated = [...categories.slice(0, criteria.count), ...risks.slice(0, criteria.count)]
    updated.sort((u1, u2) => u2.updated.getTime() - u1.updated.getTime())

    return resultsOk(updated.slice(0, criteria.count))
  }
}

export type { UpdatedRepoJson }
export { newUpdatedRepoJson }
