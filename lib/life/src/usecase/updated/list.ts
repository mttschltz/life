import { Updated as UpdatedUsecase, UpdatedMapper } from '@life/usecase/mapper'
import { Results } from '@util/result'
import { UpdatedRepo } from '@life/repo'

type ListUpdatedRepo = Pick<UpdatedRepo, 'list'>
type ListUpdatedMapper = Pick<UpdatedMapper, 'updated'>

interface ListUpdatedInteractor {
  list: (criteria: { count: number }) => Promise<Results<UpdatedUsecase>>
}

function newListUpdatedInteractor(repo: ListUpdatedRepo, mapper: ListUpdatedMapper): ListUpdatedInteractor {
  return new ListUpdatedInteractorImpl(repo, mapper)
}

class ListUpdatedInteractorImpl implements ListUpdatedInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: ListUpdatedRepo
  #mapper: ListUpdatedMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: ListUpdatedRepo, mapper: ListUpdatedMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  public async list(criteria: { count: number }): Promise<Results<UpdatedUsecase>> {
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

export type { ListUpdatedMapper, ListUpdatedRepo, ListUpdatedInteractor }
export { newListUpdatedInteractor }
