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
  listCategories: (criteria: { includeChildren: boolean }) => Promise<Results<Category>>
}

export type { CategoryRepo, RiskRepo }
