import {
  newCategoryMapper as newCategoryMapperUsecase,
  newRiskMapper as newRiskMapperUsecase,
} from '@life/usecase/mapper'
import { ListRisksInteractor } from '@life/usecase/risk/listRisks'
import { FetchRiskChildrenInteractor } from '@life/usecase/risk/fetchRiskChildren'
import { FetchRiskParentInteractor } from '@life/usecase/risk/fetchRiskParent'
import { CreateRiskInteractor } from '@life/usecase/risk/createRisk'
import { ListInteractor, newListInteractor } from '@life/usecase/category/list'
import { CategoryRepo, RiskRepo } from '@life/repo'
import { FetchInteractor, newFetchInteractor } from '@life/usecase/category/fetch'
import { FetchParentInteractor, newFetchParentInteractor } from '@life/usecase/category/fetchParent'
import { FetchChildrenInteractor, newFetchChildrenInteractor } from '@life/usecase/category/fetchChildren'

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
    return new ListRisksInteractor(this.repo, newRiskMapperUsecase())
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
  listInteractor: () => ListInteractor
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

  public listInteractor(): ListInteractor {
    return newListInteractor(this.#repo, newCategoryMapperUsecase())
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

type InteractorFactory = {
  category: CategoryInteractorFactory
  risk: RiskInteractorFactory
}

export type { InteractorFactory, RiskInteractorFactory, CategoryInteractorFactory }
export { newRiskInteractorFactory, newCategoryInteractorFactory }
