import { CategoryMapper as UsecaseCategoryMapper, RiskMapper as UsecaseRiskMapper } from '@life/usecase/mapper'
import { ListRisksInteractor } from '@life/usecase/listRisks'
import { FetchRiskChildrenInteractor } from '@life/usecase/fetchRiskChildren'
import { FetchRiskParentInteractor } from '@life/usecase/fetchRiskParent'
import { CreateRiskInteractor } from '@life/usecase/createRisk'
import { ListCategoriesInteractor } from '@life/usecase/listCategories'
import { CategoryRepo, RiskRepo } from '@life/repo'

class RiskInteractorFactory {
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

class CategoryInteractorFactory {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #repo: CategoryRepo
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(repo: CategoryRepo) {
    this.#repo = repo
  }

  public listCategoriesInteractor(): ListCategoriesInteractor {
    return new ListCategoriesInteractor(this.#repo, new UsecaseCategoryMapper())
  }
}

export { RiskInteractorFactory, CategoryInteractorFactory }
