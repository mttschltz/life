// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Result, resultError, resultOk, Results, results, resultsError, resultsErrorResult } from '@util/result'
import { CategoryRepo, CategoryRepo as CategoryRepoDomain } from '@life/repo'
import { CategoryJson, CategoryMapper } from '@life/repo/json/mapper'
import { Category } from '@life/category'
import { JsonStore } from './service'

type CategoryRepoJson = CategoryRepoDomain

function newCategoryRepoJson(store: JsonStore, mapper: CategoryMapper): CategoryRepoJson {
  return new CategoryRepoJsonImpl(store, mapper)
}

class CategoryRepoJsonImpl implements CategoryRepoJson {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #store: JsonStore
  #mapper: CategoryMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(store: JsonStore, mapper: CategoryMapper) {
    this.#store = store
    this.#mapper = mapper
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async fetch(id: string): Promise<Result<Category>> {
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

  public async fetchParent(childId: string): Promise<Result<Category | undefined>> {
    const jsonCategory = this.#store.category[childId]
    if (!jsonCategory) return resultError(`Could not find category '${childId}'`)

    if (!jsonCategory.parentId) {
      return resultOk(undefined)
    }

    return this.fetch(jsonCategory.parentId)
  }

  public async fetchChildren(id: string): Promise<Results<Category>> {
    const jsonCategory = this.#store.category[id]
    if (!jsonCategory) return resultsError(`Could not find category '${id}'`)

    const childrenResults = await Promise.all(
      jsonCategory.children.map(async (childId) => {
        return this.fetch(childId)
      }),
    )
    return results(childrenResults)
  }

  public async list(criteria: Parameters<CategoryRepo['list']>[0]): Promise<Results<Category>> {
    const jsonCategories = Object.values(this.#store.category)
    const categoryResults = []
    for (const jsonCategory of jsonCategories) {
      if (criteria.onlyRoot && jsonCategory.parentId) {
        continue
      }

      const riskResult = await this.fetch(jsonCategory.id)
      if (!riskResult.ok) {
        return resultsErrorResult(riskResult)
      }

      categoryResults.push(riskResult)
    }
    return results(categoryResults)
  }
}

export type { CategoryRepoJson }
export { newCategoryRepoJson }
