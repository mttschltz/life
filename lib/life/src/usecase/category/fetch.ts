import { Category } from '@life/usecase/mapper'
import { Result, resultError } from '@util/result'

interface FetchInteractor {
  fetch: (id: string) => Promise<Result<Category>>
}

function newFetchInteractor(): FetchInteractor {
  return new FetchInteractorImpl()
}

class FetchInteractorImpl implements FetchInteractor {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async fetch(): Promise<Result<Category>> {
    return resultError('not implemented')
  }
}

export type { FetchInteractor }
export { newFetchInteractor }
