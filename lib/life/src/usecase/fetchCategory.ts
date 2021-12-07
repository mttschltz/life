import { Category as UsecaseCategory } from '@life/usecase/mapper'
import { Result, resultError } from '@util/result'

interface FetchCategoryInteractor {
  fetchCategory: (id: string) => Promise<Result<UsecaseCategory>>
}

function newFetchCategoryInteractor(): FetchCategoryInteractor {
  return new FetchCategoryInteractorImpl()
}

class FetchCategoryInteractorImpl implements FetchCategoryInteractor {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async fetchCategory(): Promise<Result<UsecaseCategory>> {
    return resultError('not implemented')
  }
}

export type { FetchCategoryInteractor }
export { newFetchCategoryInteractor }
