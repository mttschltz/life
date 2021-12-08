import { CategoryRepo } from '@life/repo'
import { Category as UsecaseCategory, CategoryMapper } from '@life/usecase/mapper'
import { Result, resultOk } from '@util/result'

type FetchParentRepo = Pick<CategoryRepo, 'fetchParent'>
type FetchParentMapper = Pick<CategoryMapper, 'category'>

interface FetchParentInteractor {
  fetchParent: (childId: string) => Promise<Result<UsecaseCategory | undefined>>
}

function newFetchParentInteractor(repo: FetchParentRepo, mapper: FetchParentMapper): FetchParentInteractor {
  return new FetchParentInteractorImpl(repo, mapper)
}

class FetchParentInteractorImpl implements FetchParentInteractor {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: FetchParentRepo
  #mapper: FetchParentMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: FetchParentRepo, mapper: FetchParentMapper) {
    this.#repo = repo
    this.#mapper = mapper
  }

  public async fetchParent(childId: string): Promise<Result<UsecaseCategory | undefined>> {
    const parentResult = await this.#repo.fetchParent(childId)
    if (!parentResult.ok) {
      return parentResult
    }

    if (!parentResult.value) {
      return resultOk(undefined)
    }

    return resultOk(this.#mapper.category(parentResult.value))
  }
}

export type { FetchParentInteractor, FetchParentRepo, FetchParentMapper }
export { newFetchParentInteractor }
