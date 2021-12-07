import { Category as UsecaseCategory } from '@life/usecase/mapper'
import { Result, resultError } from '@util/result'

interface FetchParentInteractor {
  fetchParent: (id: string) => Promise<Result<UsecaseCategory | undefined>>
}

function newFetchParentInteractor(): FetchParentInteractor {
  return new FetchParentInteractorImpl()
}

class FetchParentInteractorImpl implements FetchParentInteractor {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async fetchParent(): Promise<Result<UsecaseCategory | undefined>> {
    return resultError('not implemented')
  }
}

export type { FetchParentInteractor }
export { newFetchParentInteractor }
