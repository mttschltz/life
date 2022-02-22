import { CategoryRepo } from '@life/repo'
import { Category, CategoryMapper } from '@life/usecase/mapper'
import { Results, resultsErrorResult, resultsOk } from '@helper/result'

type ListChildrenRepo = Pick<CategoryRepo, 'listChildren'>
type ListChildrenMapper = Pick<CategoryMapper, 'categories'>

interface ListChildrenInteractor {
  listChildren: (id: string) => Promise<Results<Category>>
}

function newListChildrenInteractor(repo: ListChildrenRepo, mapper: ListChildrenMapper): ListChildrenInteractor {
  return new ListChildrenInteractorImpl(repo, mapper)
}

class ListChildrenInteractorImpl implements ListChildrenInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: ListChildrenRepo
  #mapper: ListChildrenMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: ListChildrenRepo, mapper: ListChildrenMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async listChildren(id: string): Promise<Results<Category>> {
    const childrenResults = await this.#repo.listChildren(id)
    if (childrenResults.firstErrorResult) {
      return resultsErrorResult(childrenResults.firstErrorResult)
    }

    return resultsOk(this.#mapper.categories(childrenResults.okValues))
  }
}

export type { ListChildrenInteractor, ListChildrenRepo, ListChildrenMapper }
export { newListChildrenInteractor }
