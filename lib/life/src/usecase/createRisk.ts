// import { Category } from '@life/usecase/usecaseType'
import { mapRiskToUsecase, Risk as UsecaseRisk } from '@life/usecase/usecaseType'
import { Category, Impact, Likelihood, Risk, RiskType } from '@life/risk'
import { Result } from '@util/result'

export interface CreateRiskRequest {
  uriPart: string
  name: string
  category: Category
  impact: Impact
  likelihood: Likelihood
  notes?: string
  type: RiskType
  parentId: string
}

export interface CreateRiskRepo {
  fetchRisk: (id: string) => Result<Risk>
}

export class CreateRiskInteractor {
  #repo: CreateRiskRepo

  constructor(repo: CreateRiskRepo) {
    this.#repo = repo
  }

  createRisk({
    uriPart,
    type,
    parentId,
    name,
    likelihood,
    impact,
    category,
    notes,
  }: CreateRiskRequest): Result<UsecaseRisk> {
    if (!uriPart || /^[a-z]+[a-z-]+[a-z]+$/.test(uriPart)) {
      return Result.error(`Invalid URI part: ${uriPart}`)
    }

    let parent
    if (parentId) {
      const parentResult = this.#repo.fetchRisk(parentId)
      if (!parentResult.isSuccess) {
        return Result.error(`Error fetching parent risk: ${parentResult.errorMessage}`)
      }
      parent = parentResult.getValue()
    }

    const riskResult = Risk.create(uriPart, {
      category,
      impact,
      likelihood,
      name,
      notes,
      type,
      parent,
    })
    if (!riskResult.isSuccess) {
      throw new Error(`Error creating risk: ${riskResult.errorMessage}`)
    }

    return Result.success(mapRiskToUsecase(riskResult.getValue()))
  }
}
