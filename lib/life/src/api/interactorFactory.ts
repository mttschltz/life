import {
  newCategoryMapper as newCategoryMapperUsecase,
  newRiskMapper as newRiskMapperUsecase,
  newUpdatedMapper,
} from '@life/usecase/mapper'
import { ListInteractor as ListRiskInteractor } from '@life/usecase/risk/list'
import { FetchRiskChildrenInteractor } from '@life/usecase/risk/fetchRiskChildren'
import { FetchRiskParentInteractor } from '@life/usecase/risk/fetchRiskParent'
import { CreateRiskInteractor } from '@life/usecase/risk/createRisk'
import {
  ListInteractor as ListCategoryInteractor,
  newListInteractor as newListCategoriesInteractor,
} from '@life/usecase/category/list'
import { CategoryRepo, RiskRepo, UpdatedRepo } from '@life/repo'
import { FetchInteractor, newFetchInteractor } from '@life/usecase/category/fetch'
import { FetchParentInteractor, newFetchParentInteractor } from '@life/usecase/category/fetchParent'
import { FetchChildrenInteractor, newFetchChildrenInteractor } from '@life/usecase/category/fetchChildren'
import { ListInteractor, newListInteractor as newListUpdatedInteractor } from '@life/usecase/updated/list'

interface RiskInteractorFactory {
  listInteractor: () => ListRiskInteractor
  fetchRiskParentInteractor: () => FetchRiskParentInteractor
  fetchRiskChildrenInteractor: () => FetchRiskChildrenInteractor
  createRiskInteractor: () => CreateRiskInteractor
}

function newRiskInteractorFactory(repo: RiskRepo): RiskInteractorFactory {
  return new RiskInteractorFactoryImpl(repo)
}

class RiskInteractorFactoryImpl implements RiskInteractorFactory {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  repo: RiskRepo
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: RiskRepo) {
    this.repo = repo
  }

  public listInteractor(): ListRiskInteractor {
    return new ListRiskInteractor(this.repo, newRiskMapperUsecase())
  }

  public fetchRiskParentInteractor(): FetchRiskParentInteractor {
    return new FetchRiskParentInteractor(this.repo, newRiskMapperUsecase())
  }

  public fetchRiskChildrenInteractor(): FetchRiskChildrenInteractor {
    return new FetchRiskChildrenInteractor(this.repo, newRiskMapperUsecase())
  }

  public createRiskInteractor(): CreateRiskInteractor {
    return new CreateRiskInteractor(this.repo, newRiskMapperUsecase())
  }
}

interface CategoryInteractorFactory {
  listInteractor: () => ListCategoryInteractor
  fetchInteractor: () => FetchInteractor
  fetchParentInteractor: () => FetchParentInteractor
  fetchChildrenInteractor: () => FetchChildrenInteractor
}

function newCategoryInteractorFactory(repo: CategoryRepo): CategoryInteractorFactory {
  return new CategoryInteractorFactoryImpl(repo)
}

class CategoryInteractorFactoryImpl implements CategoryInteractorFactory {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: CategoryRepo
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: CategoryRepo) {
    this.#repo = repo
  }

  public listInteractor(): ListCategoryInteractor {
    return newListCategoriesInteractor(this.#repo, newCategoryMapperUsecase())
  }

  public fetchInteractor(): FetchInteractor {
    return newFetchInteractor()
  }

  public fetchParentInteractor(): FetchParentInteractor {
    return newFetchParentInteractor(this.#repo, newCategoryMapperUsecase())
  }

  public fetchChildrenInteractor(): FetchChildrenInteractor {
    return newFetchChildrenInteractor(this.#repo, newCategoryMapperUsecase())
  }
}

interface UpdatedInteractorFactory {
  listInteractor: () => ListInteractor
}

function newUpdatedInteractorFactory(repo: UpdatedRepo): UpdatedInteractorFactory {
  return new UpdatedInteractorFactoryImpl(repo)
}

class UpdatedInteractorFactoryImpl implements UpdatedInteractorFactory {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: UpdatedRepo
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: UpdatedRepo) {
    this.#repo = repo
  }

  public listInteractor(): ListInteractor {
    return newListUpdatedInteractor(this.#repo, newUpdatedMapper(newCategoryMapperUsecase(), newRiskMapperUsecase()))
  }
}

type InteractorFactory = {
  category: CategoryInteractorFactory
  risk: RiskInteractorFactory
  updated: UpdatedInteractorFactory
}

export type { InteractorFactory, RiskInteractorFactory, CategoryInteractorFactory, UpdatedInteractorFactory }
export { newRiskInteractorFactory, newCategoryInteractorFactory, newUpdatedInteractorFactory }
