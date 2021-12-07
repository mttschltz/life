import { Category as UsecaseCategory, CategoryMapper } from '@life/usecase/mapper'
import { Results, resultsOk } from '@util/result'
import { CategoryRepo } from '@life/repo'

type ListCategoriesRepo = Pick<CategoryRepo, 'listCategories'>
type ListCategoriesMapper = Pick<CategoryMapper, 'categories'>

interface ListCategoriesInteractor {
  listCategories: () => Promise<Results<UsecaseCategory>>
}

function newListCategoriesInteractor(repo: ListCategoriesRepo, mapper: ListCategoriesMapper): ListCategoriesInteractor {
  return new ListCategoriesInteractorImpl(repo, mapper)
}

class ListCategoriesInteractorImpl implements ListCategoriesInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: ListCategoriesRepo
  #mapper: ListCategoriesMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: ListCategoriesRepo, mapper: ListCategoriesMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  public async listCategories(): Promise<Results<UsecaseCategory>> {
    const fetchedResults = await this.#repo.listCategories({ includeChildren: true })
    if (fetchedResults.firstErrorResult) {
      return fetchedResults.withOnlyFirstError<UsecaseCategory>()
    }

    return resultsOk(this.#mapper.categories(fetchedResults.okValues))
  }
}

export type { ListCategoriesMapper, ListCategoriesRepo, ListCategoriesInteractor }
export { newListCategoriesInteractor }
