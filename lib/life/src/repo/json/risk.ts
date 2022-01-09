// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { CategoryTopLevel, Risk } from '@life/risk'
import { Result, resultError, resultOk, results, Results, resultsOk } from '@util/result'
import { RiskRepo as RiskRepoDomain } from '@life/repo'
import { RiskMapper } from '@life/repo/json/mapper'
import { JsonStore } from './service'

type RiskRepoJson = RiskRepoDomain

function newRiskRepoJson(store: JsonStore, mapper: RiskMapper): RiskRepoJson {
  return new RiskRepoJsonImpl(store, mapper)
}

class RiskRepoJsonImpl implements RiskRepoJson {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #store: JsonStore
  #mapper: RiskMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(store: JsonStore, mapper: RiskMapper) {
    this.#store = store
    this.#mapper = mapper
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async createRisk(risk: Risk): Promise<Result<void>> {
    if (this.#store.risk[risk.id]) {
      return resultError(`Risk with id '${risk.id}' already exists`)
    }

    if (risk.parent) {
      if (!this.#store.risk[risk.parent.id]) {
        return resultError(`Could not find parent with id ${risk.parent.id} for risk with id ${risk.id}`)
      }
    }

    this.#store.risk[risk.id] = this.#mapper.toJson(risk)
    return resultOk(undefined)
  }

  public async fetchRisk(id: string): Promise<Result<Risk>> {
    const jsonRisk = this.#store.risk[id]
    if (!jsonRisk) return resultError(`Could not find risk ${id}`)

    let parent
    if (jsonRisk.parentId) {
      const parentResult = await this.fetchRisk(jsonRisk.parentId)
      if (!parentResult.ok) {
        return parentResult
      }
      parent = parentResult.value
    }

    const riskResult = this.#mapper.fromJson(jsonRisk, parent)
    if (!riskResult.ok) {
      return riskResult
    }

    return resultOk(riskResult.value)
  }

  public async fetchRiskParent(id: string): Promise<Result<Risk | undefined>> {
    const jsonRisk = this.#store.risk[id]
    if (!jsonRisk) return resultError(`Could not find risk ${id}`)

    if (!jsonRisk.parentId) {
      return resultOk(undefined)
    }

    const parentRiskResult = await this.fetchRisk(jsonRisk.parentId)
    if (!parentRiskResult.ok) {
      return parentRiskResult
    }

    return resultOk(parentRiskResult.value)
  }

  public async fetchRiskChildren(id: string): Promise<Result<Risk[]>> {
    const jsonRisks = Object.values(this.#store.risk)
    const riskChildren = []
    for (const jsonRisk of jsonRisks) {
      if (jsonRisk.parentId !== id) {
        continue
      }

      const childResult = await this.fetchRisk(jsonRisk.id)
      if (!childResult.ok) {
        return childResult
      }

      riskChildren.push(childResult.value)
    }
    return resultOk(riskChildren)
  }

  public async list(category: CategoryTopLevel | undefined, includeDescendents: boolean): Promise<Results<Risk>> {
    const jsonRisks = Object.values(this.#store.risk)
    const risks = []
    for (const jsonRisk of jsonRisks) {
      if (category && jsonRisk.category !== category) {
        continue
      }

      if (!includeDescendents && jsonRisk.parentId) {
        continue
      }

      const riskResult = await this.fetchRisk(jsonRisk.id)
      if (!riskResult.ok) {
        return results([riskResult])
      }

      risks.push(riskResult.value)
    }
    return resultsOk(risks)
  }
}

export type { RiskRepoJson }
export { newRiskRepoJson }
