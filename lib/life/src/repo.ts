import { Result } from 'util/result'
import { Category, Risk } from 'life/src/risk'

export interface RiskRepo {
  createRisk(risk: Risk): Promise<Result<void>>
  fetchRisk(id: string): Promise<Result<Risk>>
  fetchRiskChildren(id: string): Promise<Result<Risk[]>>
  fetchRiskParent(id: string): Promise<Result<Risk | undefined>>
  listRisks(category: Category | undefined, includeDescendents: boolean): Promise<Result<Risk[]>>
}
