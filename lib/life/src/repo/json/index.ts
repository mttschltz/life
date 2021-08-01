import { Risk } from '@life'
import { Result } from '@util'
import { Category } from '@life/risk'
import { RiskRepo } from '@life/repo'
import { RiskJson, RiskMapper } from './mapper'

export interface Json {
  risk: {
    [key: string]: RiskJson
  }
}

export class JsonRepo implements RiskRepo {
  #json: Json
  #mapper: RiskMapper

  constructor(json: Partial<Json>, mapper: RiskMapper) {
    const risk = json.risk || {}
    this.#json = {
      risk,
    }
    this.#mapper = mapper
  }

  createRisk(risk: Risk): Result<void> {
    if (this.#json.risk[risk.id]) {
      return Result.error(`Risk with id '${risk.id}' already exists`)
    }

    if (risk.parent) {
      if (!this.#json.risk[risk.parent.id]) {
        return Result.error(`Could not find parent with id ${risk.parent.id} for risk with id ${risk.id}`)
      }
    }

    this.#json.risk[risk.id] = this.#mapper.toJson(risk)
    return Result.success(undefined)
  }

  fetchRisk(id: string): Result<Risk> {
    const jsonRisk = this.#json.risk[id]
    if (!jsonRisk) return Result.error(`Could not find risk ${id}`)

    let parent
    if (jsonRisk.parentId) {
      const parentResult = this.fetchRisk(jsonRisk.parentId)
      if (!parentResult.isSuccess()) {
        return parentResult
      }
      parent = parentResult.getValue()
    }

    const riskResult = this.#mapper.fromJson(jsonRisk, parent)
    if (!riskResult.isSuccess()) {
      return riskResult
    }

    return Result.success(riskResult.getValue())
  }

  fetchRiskParent(id: string): Result<Risk | undefined> {
    const jsonRisk = this.#json.risk[id]
    if (!jsonRisk) return Result.error(`Could not find risk ${id}`)

    if (!jsonRisk.parentId) {
      return Result.success(undefined)
    }

    const parentRiskResult = this.fetchRisk(jsonRisk.parentId)
    if (!parentRiskResult.isSuccess()) {
      return parentRiskResult
    }

    return Result.success(parentRiskResult.getValue())
  }

  listRisks(category: Category | undefined, includeDescendents: boolean): Result<Risk[]> {
    const jsonRisks = Object.values(this.#json.risk)
    const risks = []
    for (let i = 0; i < jsonRisks.length; i++) {
      const jsonRisk = jsonRisks[i]
      if (category && jsonRisk.category !== category) {
        continue
      }

      if (!includeDescendents && jsonRisk.parentId) {
        continue
      }

      const riskResult = this.fetchRisk(jsonRisk.id)
      if (!riskResult.isSuccess()) {
        return Result.errorFrom(riskResult)
      }

      risks.push(riskResult.getValue())
    }
    return Result.success(risks)
  }
}
