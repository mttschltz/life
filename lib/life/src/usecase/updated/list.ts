import { Updated, UpdatedMapper } from '@life/usecase/mapper'
import { Results } from '@util/result'
import { UpdatedRepo } from '@life/repo'

type ListRepo = Pick<UpdatedRepo, 'list'>
type ListMapper = Pick<UpdatedMapper, 'updated'>

interface ListInteractor {
  list: (criteria: { count: number }) => Promise<Results<Updated>>
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

  public async list(criteria: { count: number }): Promise<Results<Updated>> {
    const fetchedResults = await this.#repo.list({ count: criteria.count })
    if (fetchedResults.firstErrorResult) {
      return fetchedResults.withOnlyFirstError()
    }

    const mappedResult = this.#mapper.updated(fetchedResults.okValues)
    if (mappedResult.firstErrorResult) {
      return mappedResult.withOnlyFirstError()
    }
    return mappedResult
  }
}

export type { ListMapper, ListRepo, ListInteractor }
export { newListInteractor }
