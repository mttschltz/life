import { Result } from 'util/result'
import { Category, Risk } from 'life/src/risk'

export interface RiskRepo {
  createRisk(risk: Risk): Result<void>
  fetchRisk(id: string): Result<Risk>
  fetchRiskParent(id: string): Result<Risk | undefined>
  listRisks(category: Category | undefined, includeDescendents: boolean): Result<Risk[]>
}
