import { Category as UsecaseCategory, CategoryMapper } from '@life/usecase/mapper'
import { Result, resultOk } from '@util/result'
import { CategoryRepo } from '@life/repo'

type ListCategoriesRepo = Pick<CategoryRepo, 'listCategories'>
type ListCategoriesMapper = Pick<CategoryMapper, 'categories'>

class ListCategoriesInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: ListCategoriesRepo
  #mapper: ListCategoriesMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: ListCategoriesRepo, mapper: ListCategoriesMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  public async listCategories(): Promise<Result<UsecaseCategory[]>> {
    const categoriesResult = await this.#repo.listCategories({ includeChildren: true })
    if (!categoriesResult.ok) {
      return categoriesResult
    }

    return resultOk(this.#mapper.categories(categoriesResult.value))
  }
}

export type { ListCategoriesMapper, ListCategoriesRepo }
export { ListCategoriesInteractor }
