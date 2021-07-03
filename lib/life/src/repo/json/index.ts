import { Repo } from 'life/src/repo'
import { Risk } from 'life/src'
import { Result } from 'lib/util'
import { CreateDetails } from 'life/src/risk'

type RiskJson = Omit<Risk, 'parent' | 'mitigations'> & { parentId?: string }

interface Json {
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

export class JsonRepo implements Repo {
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
    return Result.success()
  }

  fetchRisk(id: string): Result<Risk> {
    const jsonRisk = this.#json.risk[id]
    if (!jsonRisk) return Result.error(`Could not find risk ${id}`)

    let parent
    if (jsonRisk.parentId) {
      const parentJson = this.#json.risk[id]
      if (!parentJson) {
        return Result.error(`Could not find parent with id ${jsonRisk.parentId} for risk with id ${id}`)
      }

      const parentResult = Risk.create(jsonRisk.id, mapJsonToRiskCreateDetails(parentJson))
      if (!parentResult.isSuccess) {
        return parentResult
      }
      parent = parentResult.getValue()
    }

    const riskResult = Risk.create(jsonRisk.id, mapJsonToRiskCreateDetails(jsonRisk, parent))
    if (!riskResult.isSuccess) {
      return riskResult
    }

    return Result.success(riskResult.getValue())
  }

  listRisks(): Risk[] {
    // TODO: Loop through and get all :)
    return []
  }
}
