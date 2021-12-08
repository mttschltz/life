import { CategoryRepo } from '@life/repo'
import { Category as UsecaseCategory, CategoryMapper } from '@life/usecase/mapper'
import { Results, resultsOk } from '@util/result'

type FetchChildrenRepo = Pick<CategoryRepo, 'fetchChildren'>
type FetchChildrenMapper = Pick<CategoryMapper, 'categories'>

interface FetchChildrenInteractor {
  fetchChildren: (id: string) => Promise<Results<UsecaseCategory>>
}

function newFetchChildrenInteractor(repo: FetchChildrenRepo, mapper: FetchChildrenMapper): FetchChildrenInteractor {
  return new FetchChildrenInteractorImpl(repo, mapper)
}

class FetchChildrenInteractorImpl implements FetchChildrenInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: FetchChildrenRepo
  #mapper: FetchChildrenMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: FetchChildrenRepo, mapper: FetchChildrenMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async fetchChildren(id: string): Promise<Results<UsecaseCategory>> {
    const childrenResults = await this.#repo.fetchChildren(id)
    if (childrenResults.firstErrorResult) {
      return childrenResults
    }

    return resultsOk(this.#mapper.categories(childrenResults.okValues))
  }
}

export type { FetchChildrenInteractor, FetchChildrenRepo, FetchChildrenMapper }
export { newFetchChildrenInteractor }
