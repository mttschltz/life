import { Category as UsecaseCategory } from '@life/usecase/mapper'
import { Results, resultsError } from '@util/result'

interface FetchChildrenInteractor {
  fetchChildren: (id: string) => Promise<Results<UsecaseCategory>>
}

function newFetchChildrenInteractor(): FetchChildrenInteractor {
  return new FetchChildrenInteractorImpl()
}

class FetchChildrenInteractorImpl implements FetchChildrenInteractor {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async fetchChildren(): Promise<Results<UsecaseCategory>> {
    return resultsError('not implemented')
  }
}

export type { FetchChildrenInteractor }
export { newFetchChildrenInteractor }
