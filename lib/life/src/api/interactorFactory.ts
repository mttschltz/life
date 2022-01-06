import {
  CategoryMapper as UsecaseCategoryMapper,
  RiskMapper as UsecaseRiskMapper,
  newUpdatedMapper,
} from '@life/usecase/mapper'
import { ListRisksInteractor } from '@life/usecase/risk/listRisks'
import { FetchRiskChildrenInteractor } from '@life/usecase/risk/fetchRiskChildren'
import { FetchRiskParentInteractor } from '@life/usecase/risk/fetchRiskParent'
import { CreateRiskInteractor } from '@life/usecase/risk/createRisk'
import { ListInteractor, newListInteractor } from '@life/usecase/category/list'
import { CategoryRepo, RiskRepo, UpdatedRepo } from '@life/repo'
import { FetchInteractor, newFetchInteractor } from '@life/usecase/category/fetch'
import { FetchParentInteractor, newFetchParentInteractor } from '@life/usecase/category/fetchParent'
import { FetchChildrenInteractor, newFetchChildrenInteractor } from '@life/usecase/category/fetchChildren'
import { ListUpdatedInteractor, newListUpdatedInteractor } from '@life/usecase/updated/list'
import { Updated } from '@life/updated'
import { Result, resultOk, results } from '@util/result'
import { Category } from '@life/category'
import { CategoryTopLevel, Impact, Likelihood, Risk, RiskType } from '@life/risk'

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
    return newListInteractor(this.#repo, new UsecaseCategoryMapper())
  }

  public fetchInteractor(): FetchInteractor {
    return newFetchInteractor()
  }

  public fetchParentInteractor(): FetchParentInteractor {
    return newFetchParentInteractor(this.#repo, new UsecaseCategoryMapper())
  }

  public fetchChildrenInteractor(): FetchChildrenInteractor {
    return newFetchChildrenInteractor(this.#repo, new UsecaseCategoryMapper())
  }
}

interface UpdatedInteractorFactory {
  listInteractor: () => ListUpdatedInteractor
}

function newUpdatedInteractorFactory(/*repo: UpdatedRepo*/): UpdatedInteractorFactory {
  return new UpdatedInteractorFactoryImpl()
}

class UpdatedInteractorFactoryImpl implements UpdatedInteractorFactory {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  // #repo: UpdatedRepo
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  // public constructor(repo: UpdatedRepo) {
  //   this.#repo = repo
  // }

  public listInteractor(): ListUpdatedInteractor {
    // TODO: Remove hardcoded test repo
    const repo: UpdatedRepo = {
      list: async () => {
        // Promise<Results<Updated>>
        const updated: Result<Updated>[] = [
          resultOk<Category>({
            id: '3',
            name: 'child category 3',
            path: '/child-category-3',
            description: 'child category 3 with child',
            shortDescription: 'cc3 with child',
            children: [
              {
                id: '4',
                name: 'grandchild category 4',
                path: '/grandchild-category-4',
                description: 'grandchild category 4 with child',
                shortDescription: 'gc4 with child',
                children: [],
                updated: new Date('2021-12-04'),
              },
            ],
            parent: {
              id: '1',
              name: 'root category 1',
              path: '/root-category-1',
              description: 'root category 1 with child',
              shortDescription: 'rc1 with child',
              children: [],
              updated: new Date('2021-12-01'),
            },
            updated: new Date('2021-12-03'),
          }),
          resultOk<Risk>({
            id: 'test id',
            name: 'test name',
            shortDescription: 'test short desc',
            updated: new Date(),
            category: CategoryTopLevel.Health,
            impact: Impact.High,
            likelihood: Likelihood.High,
            type: RiskType.Condition,
          }),
        ]
        return Promise.resolve(results(updated))
      },
    }
    return newListUpdatedInteractor(repo, newUpdatedMapper(new UsecaseCategoryMapper(), new UsecaseRiskMapper()))
  }
}

type InteractorFactory = {
  category: CategoryInteractorFactory
  risk: RiskInteractorFactory
  updated: UpdatedInteractorFactory
}

export type { InteractorFactory, RiskInteractorFactory, CategoryInteractorFactory, UpdatedInteractorFactory }
export { newRiskInteractorFactory, newCategoryInteractorFactory, newUpdatedInteractorFactory }
