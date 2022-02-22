import { Result, Results } from '@helper/result'
import { CategoryTopLevel, Risk } from '@life/risk'
import { Category } from '@life/category'
import { Updated } from './updated'

interface RiskRepo {
  createRisk: (risk: Risk) => Promise<Result<void>>
  fetchRisk: (id: string) => Promise<Result<Risk>>
  fetchRiskChildren: (id: string) => Promise<Result<Risk[]>>
  fetchRiskParent: (id: string) => Promise<Result<Risk | undefined>>
  list: (category: CategoryTopLevel | undefined, includeDescendents: boolean) => Promise<Results<Risk>>
}

interface CategoryRepo {
  fetch: (id: string) => Promise<Result<Category>>
  fetchParent: (childId: string) => Promise<Result<Category | undefined>>
  list: (criteria: { onlyRoot: boolean }) => Promise<Results<Category>>
  listChildren: (id: string) => Promise<Results<Category>>
  listAncestors: (id: string) => Promise<Results<Category>>
}

interface UpdatedRepo {
  list: (criteria: { count: number }) => Promise<Results<Updated>>
}

export type { CategoryRepo, RiskRepo, UpdatedRepo }
