import { Category, CategoryMapper } from '@life/usecase/mapper'
import { Results, resultsOk } from '@util/result'
import { CategoryRepo } from '@life/repo'

type ListRepo = Pick<CategoryRepo, 'list'>
type ListMapper = Pick<CategoryMapper, 'categories'>

interface ListInteractor {
  list: () => Promise<Results<Category>>
}

function newListInteractor(repo: ListRepo, mapper: ListMapper): ListInteractor {
  return new ListInteractorImpl(repo, mapper)
}

class ListInteractorImpl implements ListInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: ListRepo
  #mapper: ListMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: ListRepo, mapper: ListMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  public async list(): Promise<Results<Category>> {
    const fetchedResults = await this.#repo.list({ onlyRoot: true })
    if (fetchedResults.firstErrorResult) {
      return fetchedResults.withOnlyFirstError<Category>()
    }

    return resultsOk(this.#mapper.categories(fetchedResults.okValues))
  }
}

export type { ListMapper, ListRepo, ListInteractor }
export { newListInteractor }
