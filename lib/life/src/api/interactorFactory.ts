import { CategoryMapper as UsecaseCategoryMapper, RiskMapper as UsecaseRiskMapper } from '@life/usecase/mapper'
import { ListRisksInteractor } from '@life/usecase/listRisks'
import { FetchRiskChildrenInteractor } from '@life/usecase/fetchRiskChildren'
import { FetchRiskParentInteractor } from '@life/usecase/fetchRiskParent'
import { CreateRiskInteractor } from '@life/usecase/createRisk'
import { ListCategoriesInteractor, newListCategoriesInteractor } from '@life/usecase/listCategories'
import { CategoryRepo, RiskRepo } from '@life/repo'
import { FetchCategoryInteractor, newFetchCategoryInteractor } from '@life/usecase/fetchCategory'
import { FetchParentInteractor, newFetchParentInteractor } from '@life/usecase/fetchParent'
import { FetchChildrenInteractor, newFetchChildrenInteractor } from '@life/usecase/fetchChildren'

interface RiskInteractorFactory {
  listRisksInteractor: () => ListRisksInteractor
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

  public listRisksInteractor(): ListRisksInteractor {
    return new ListRisksInteractor(this.repo, new UsecaseRiskMapper())
  }

  public fetchRiskParentInteractor(): FetchRiskParentInteractor {
    return new FetchRiskParentInteractor(this.repo, new UsecaseRiskMapper())
  }

  public fetchRiskChildrenInteractor(): FetchRiskChildrenInteractor {
    return new FetchRiskChildrenInteractor(this.repo, new UsecaseRiskMapper())
  }

  public createRiskInteractor(): CreateRiskInteractor {
    return new CreateRiskInteractor(this.repo, new UsecaseRiskMapper())
  }
}

interface CategoryInteractorFactory {
  listCategoriesInteractor: () => ListCategoriesInteractor
  fetchCategoryInteractor: () => FetchCategoryInteractor
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

  public listCategoriesInteractor(): ListCategoriesInteractor {
    return newListCategoriesInteractor(this.#repo, new UsecaseCategoryMapper())
  }

  public fetchCategoryInteractor(): FetchCategoryInteractor {
    return newFetchCategoryInteractor()
  }

  public fetchParentInteractor(): FetchParentInteractor {
    return newFetchParentInteractor(this.#repo, new UsecaseCategoryMapper())
  }

  public fetchChildrenInteractor(): FetchChildrenInteractor {
    return newFetchChildrenInteractor()
  }
}

type InteractorFactory = {
  category: CategoryInteractorFactory
  risk: RiskInteractorFactory
}

export type { InteractorFactory, RiskInteractorFactory, CategoryInteractorFactory }
export { newRiskInteractorFactory, newCategoryInteractorFactory }
