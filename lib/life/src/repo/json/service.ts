// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { CategoryTopLevel, Risk } from '@life/risk'
import { Result, resultError, resultOk, Results, results, resultsErrorResult } from '@util/result'
import { CategoryRepo as CategoryRepoDomain, RiskRepo as RiskRepoDomain } from '@life/repo'
import { CategoryJson, CategoryMapper, RiskJson, RiskMapper } from '@life/repo/json/mapper'
import { Category } from '@life/category'

interface JsonStore {
  risk: {
    [key: string]: RiskJson
  }
  category: {
    [key: string]: CategoryJson
  }
}

class RiskRepoJson implements RiskRepoDomain {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #store: JsonStore
  #mapper: RiskMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(store: JsonStore, mapper: RiskMapper) {
    this.#store = store
    this.#mapper = mapper
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async createRisk(risk: Risk): Promise<Result<void>> {
    if (this.#store.risk[risk.id]) {
      return resultError(`Risk with id '${risk.id}' already exists`)
    }

    if (risk.parent) {
      if (!this.#store.risk[risk.parent.id]) {
        return resultError(`Could not find parent with id ${risk.parent.id} for risk with id ${risk.id}`)
      }
    }

    this.#store.risk[risk.id] = this.#mapper.toJson(risk)
    return resultOk(undefined)
  }

  public async fetchRisk(id: string): Promise<Result<Risk>> {
    const jsonRisk = this.#store.risk[id]
    if (!jsonRisk) return resultError(`Could not find risk ${id}`)

    let parent
    if (jsonRisk.parentId) {
      const parentResult = await this.fetchRisk(jsonRisk.parentId)
      if (!parentResult.ok) {
        return parentResult
      }
      parent = parentResult.value
    }

    const riskResult = this.#mapper.fromJson(jsonRisk, parent)
    if (!riskResult.ok) {
      return riskResult
    }

    return resultOk(riskResult.value)
  }

  public async fetchRiskParent(id: string): Promise<Result<Risk | undefined>> {
    const jsonRisk = this.#store.risk[id]
    if (!jsonRisk) return resultError(`Could not find risk ${id}`)

    if (!jsonRisk.parentId) {
      return resultOk(undefined)
    }

    const parentRiskResult = await this.fetchRisk(jsonRisk.parentId)
    if (!parentRiskResult.ok) {
      return parentRiskResult
    }

    return resultOk(parentRiskResult.value)
  }

  public async fetchRiskChildren(id: string): Promise<Result<Risk[]>> {
    const jsonRisks = Object.values(this.#store.risk)
    const riskChildren = []
    for (const jsonRisk of jsonRisks) {
      if (jsonRisk.parentId !== id) {
        continue
      }

      const childResult = await this.fetchRisk(jsonRisk.id)
      if (!childResult.ok) {
        return childResult
      }

      riskChildren.push(childResult.value)
    }
    return resultOk(riskChildren)
  }

  public async listRisks(category: CategoryTopLevel | undefined, includeDescendents: boolean): Promise<Result<Risk[]>> {
    const jsonRisks = Object.values(this.#store.risk)
    const risks = []
    for (const jsonRisk of jsonRisks) {
      if (category && jsonRisk.category !== category) {
        continue
      }

      if (!includeDescendents && jsonRisk.parentId) {
        continue
      }

      const riskResult = await this.fetchRisk(jsonRisk.id)
      if (!riskResult.ok) {
        return riskResult
      }

      risks.push(riskResult.value)
    }
    return resultOk(risks)
  }
}

class CategoryRepoJson implements CategoryRepoDomain {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #store: JsonStore
  #mapper: CategoryMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(store: JsonStore, mapper: CategoryMapper) {
    this.#store = store
    this.#mapper = mapper
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async fetchCategory(id: string): Promise<Result<Category>> {
    const jsonCategory = this.#store.category[id]
    if (!jsonCategory) return resultError(`Could not find category '${id}'`)

    let parent
    if (jsonCategory.parentId) {
      const parentJson = this.#store.category[jsonCategory.parentId]
      if (!parentJson) {
        return resultError(`Could not find parent category '${jsonCategory.parentId}'`)
      }
      // We're ignoring parent and children here for simplicity, but may need to implement this later
      // in some manner that doesn't result in recursively loading parents/children.
      const parentMapResult = this.#mapper.fromJson(parentJson, undefined, [])
      if (!parentMapResult.ok) {
        return parentMapResult
      }
      parent = parentMapResult.value
    }

    let children: Category[] = []
    if (jsonCategory.children.length) {
      const childrenFetched: { [x: string]: CategoryJson }[] = jsonCategory.children.map((childId) => ({
        [childId]: this.#store.category[childId],
      }))
      const missingChildIds = childrenFetched
        .filter((c) => !Object.entries(c)[0][1])
        .map((c) => Object.entries(c)[0][0])
      if (missingChildIds.length) {
        return resultError(`Could not find child category '${missingChildIds[0]}'`)
      }
      const childrenMapResults = results(
        // We're ignoring parent and children here for simplicity, but may need to implement this later
        // in some manner that doesn't result in recursively loading parents/children.
        childrenFetched.map((json) => this.#mapper.fromJson(Object.values(json)[0], undefined, [])),
      )
      if (childrenMapResults.firstErrorResult) {
        return childrenMapResults.firstErrorResult
      }
      children = childrenMapResults.okValues
    }

    const categoryResult = this.#mapper.fromJson(jsonCategory, parent, children)
    if (!categoryResult.ok) {
      return categoryResult
    }

    return resultOk(categoryResult.value)
  }

  public async listCategories(): Promise<Results<Category>> {
    const jsonCategories = Object.values(this.#store.category)
    const categoryResults = []
    for (const jsonCategory of jsonCategories) {
      if (jsonCategory.parentId) {
        continue
      }

      const riskResult = await this.fetchCategory(jsonCategory.id)
      if (!riskResult.ok) {
        return resultsErrorResult(riskResult)
      }

      categoryResults.push(riskResult)
    }
    return results(categoryResults)
  }
}

export type { JsonStore }
export { RiskRepoJson, CategoryRepoJson }
