import { Category } from '@life/usecase/mapper'
import { Result, resultError } from '@util/result'

interface FetchInteractor {
  fetch: (id: string) => Promise<Result<Category>>
}

// ignore code coverage while not implemented
/* c8 ignore start */
function newFetchInteractor(): FetchInteractor {
  return new FetchInteractorImpl()
}

class FetchInteractorImpl implements FetchInteractor {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async fetch(): Promise<Result<Category>> {
    return resultError('not implemented')
  }
}
/* c8 ignore stop */

export type { FetchInteractor }
export { newFetchInteractor }
