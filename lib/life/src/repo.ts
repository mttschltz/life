import { Result, Results } from 'util/result'
import { CategoryTopLevel, Risk } from '@life/risk'
import { Category } from '@life/category'

interface RiskRepo {
  createRisk: (risk: Risk) => Promise<Result<void>>
  fetchRisk: (id: string) => Promise<Result<Risk>>
  fetchRiskChildren: (id: string) => Promise<Result<Risk[]>>
  fetchRiskParent: (id: string) => Promise<Result<Risk | undefined>>
  listRisks: (category: CategoryTopLevel | undefined, includeDescendents: boolean) => Promise<Result<Risk[]>>
}

interface CategoryRepo {
  fetchCategory: (id: string) => Promise<Result<Category>>
  fetchChildren: (id: string) => Promise<Results<Category>>
  fetchParent: (childId: string) => Promise<Result<Category | undefined>>
  list: (criteria: { includeChildren: boolean }) => Promise<Results<Category>>
}

export type { CategoryRepo, RiskRepo }
