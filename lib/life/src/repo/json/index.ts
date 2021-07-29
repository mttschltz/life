import { Risk } from '@life'
import { Result } from '@util'
import { Category, CreateDetails } from '@life/risk'
import { RiskRepo } from '@life/repo'

type RiskJson = Omit<Risk, 'parent' | 'mitigations'> & { parentId?: string }

export interface Json {
  risk: {
    [key: string]: RiskJson
  }
}

const mapRiskToJson = ({ category, id, impact, likelihood, name, notes, parent, type }: Risk): RiskJson => {
  return {
    category,
    id,
    impact,
    likelihood,
    name,
    notes,
    type,
    parentId: parent?.id,
  }
}

const mapJsonToRiskCreateDetails = (
  { category, impact, likelihood, name, notes, type }: RiskJson,
  parent?: Risk,
): CreateDetails => {
  return {
    category,
    impact,
    likelihood,
    name,
    notes,
    type,
    parent,
  }
}

export class JsonRepo implements RiskRepo {
  #json: Json

  constructor(json: Partial<Json>) {
    const risk = json.risk || {}
    this.#json = {
      risk,
    }
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

    this.#json.risk[risk.id] = mapRiskToJson(risk)
    return Result.success(undefined)
  }

  fetchRisk(id: string): Result<Risk> {
    const jsonRisk = this.#json.risk[id]
    if (!jsonRisk) return Result.error(`Could not find risk ${id}`)

    const riskResult = this.fromJson(jsonRisk)
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

    const jsonParentRisk = this.#json.risk[jsonRisk.parentId]
    if (!jsonParentRisk) return Result.error(`Could not find parent risk ${jsonRisk.parentId}`)

    const riskResult = this.fromJson(jsonParentRisk)
    if (!riskResult.isSuccess()) {
      return riskResult
    }

    return Result.success(riskResult.getValue())
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

      const riskResult = this.fromJson(jsonRisk)
      if (!riskResult.isSuccess()) {
        return Result.errorFrom(riskResult)
      }

      risks.push(riskResult.getValue())
    }
    return Result.success(risks)
  }

  fromJson(jsonRisk: RiskJson): Result<Risk> {
    let parent
    if (jsonRisk.parentId) {
      const parentJson = this.#json.risk[jsonRisk.id]
      if (!parentJson) {
        return Result.error(`Could not find parent with id ${jsonRisk.parentId} for risk with id ${jsonRisk.id}`)
      }

      const parentResult = Risk.create(jsonRisk.id, mapJsonToRiskCreateDetails(parentJson))
      if (!parentResult.isSuccess()) {
        return parentResult
      }
      parent = parentResult.getValue()
    }

    return Risk.create(jsonRisk.id, mapJsonToRiskCreateDetails(jsonRisk, parent))
  }
}
