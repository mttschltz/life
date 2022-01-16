import {
  Risk as RiskUsecase,
  Category as CategoryUsecase,
  CategoryTopLevel as CategoryTopLevelUsecase,
  Updated as UpdatedUsecase,
  isUpdatedCategory as isUpdatedCategoryUsecase,
  isUpdatedRisk as isUpdatedRiskUsecase,
  Impact as ImpactUsecase,
  Likelihood as LikelihoodUsecease,
  RiskType as RiskTypeUsecase,
} from '@life/usecase/mapper'
import { Category, CategoryTopLevel, Impact, Likelihood, Risk, RiskType } from '@life/__generated__/graphql'
import { Result, resultError, resultOk, results, Results } from '@util/result'

type MdxTranspiler = (mdx?: string) => string | undefined

interface GraphMapper {
  categoryTopLevelToUsecase: (graphCategory: CategoryTopLevel) => Result<CategoryTopLevelUsecase>
  riskFromUsecase: (risk: RiskUsecase) => Result<Risk>
  risksFromUsecase: (risks: RiskUsecase[]) => Results<Risk>
  updatedFromUsecase: (updated: UpdatedUsecase[]) => Results<Category | Risk>
  categoryFromUsecase: (category: CategoryUsecase) => Result<Category>
  categoriesFromUsecase: (categories: CategoryUsecase[]) => Results<Category>
  isUpdatedCategory: (u: Category | Risk) => u is Category
  isUpdatedRisk: (u: Category | Risk) => u is Risk
}

function newMapper(mdxTranspiler: MdxTranspiler): GraphMapper {
  return new GraphMapperImpl(mdxTranspiler)
}

class GraphMapperImpl implements GraphMapper {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #mdxTranspiler: MdxTranspiler

  public constructor(mdxTranspiler: MdxTranspiler) {
    this.#mdxTranspiler = mdxTranspiler
  }

  public categoryFromUsecase(category: CategoryUsecase): Result<Category> {
    const parentResult = category.parent ? this.categoryFromUsecase(category.parent) : undefined
    if (parentResult && !parentResult.ok) {
      return parentResult
    }
    const childrenResults = results(category.children.map((c) => this.categoryFromUsecase(c)))
    if (childrenResults.firstErrorResult) {
      return childrenResults.firstErrorResult
    }
    return resultOk({
      id: category.id,
      name: category.name,
      path: category.path,
      description: category.description ?? undefined,
      shortDescription: category.shortDescription,
      parent: parentResult?.value,
      children: childrenResults.okValues,
      updated: category.updated,
    })
  }

  public categoriesFromUsecase(categories: CategoryUsecase[]): Results<Category> {
    return results(categories.map((c) => this.categoryFromUsecase(c)))
  }

  public categoryTopLevelToUsecase(graphCategory: CategoryTopLevel): Result<CategoryTopLevelUsecase> {
    switch (graphCategory) {
      case CategoryTopLevel.Health:
        return resultOk<CategoryTopLevelUsecase>('Health')
      case CategoryTopLevel.Wealth:
        return resultOk<CategoryTopLevelUsecase>('Wealth')
      case CategoryTopLevel.Security:
        return resultOk<CategoryTopLevelUsecase>('Security')
      default:
        return resultError('Unhandled category type')
    }
  }

  private categoryTopLevelFromUsecase(category: CategoryTopLevelUsecase): CategoryTopLevel {
    switch (category) {
      case 'Health':
        return CategoryTopLevel.Health
      case 'Wealth':
        return CategoryTopLevel.Wealth
      case 'Security':
        return CategoryTopLevel.Security
    }
  }

  private impactFromUsecase(impact: ImpactUsecase): Impact {
    switch (impact) {
      case 'High':
        return Impact.High
      case 'Normal':
        return Impact.Normal
    }
  }

  private likelihoodFromUsecase(likelihood: LikelihoodUsecease): Likelihood {
    switch (likelihood) {
      case 'High':
        return Likelihood.High
      case 'Normal':
        return Likelihood.Normal
    }
  }

  private riskTypeFromUsecase(type: RiskTypeUsecase): RiskType {
    switch (type) {
      case 'Condition':
        return RiskType.Condition
      case 'Goal':
        return RiskType.Goal
      case 'Risk':
        return RiskType.Risk
    }
  }

  public riskFromUsecase(risk: RiskUsecase): Result<Risk> {
    let parent: Risk | undefined
    if (risk.parent) {
      const result = this.riskFromUsecase(risk.parent)
      if (!result.ok) {
        return result
      }
      parent = result.value
    }

    return resultOk({
      id: risk.id,
      category: this.categoryTopLevelFromUsecase(risk.category),
      impact: this.impactFromUsecase(risk.impact),
      likelihood: this.likelihoodFromUsecase(risk.likelihood),
      name: risk.name,
      notes: this.#mdxTranspiler(risk.notes),
      type: this.riskTypeFromUsecase(risk.type),
      shortDescription: risk.shortDescription,
      updated: risk.updated,
      parent,
    })
  }

  public risksFromUsecase(risks: RiskUsecase[]): Results<Risk> {
    return results(risks.map((risk) => this.riskFromUsecase(risk)))
  }

  public updatedFromUsecase(updated: UpdatedUsecase[]): Results<Category | Risk> {
    const mapped: Result<Category | Risk>[] = updated.map((u) => {
      if (isUpdatedCategoryUsecase(u)) {
        return this.categoryFromUsecase(u)
      } else if (isUpdatedRiskUsecase(u)) {
        return this.riskFromUsecase(u)
      } else {
        return resultError<Category | Risk>('Unhandled Updated usecase type')
      }
    })
    return results(mapped)
  }

  public isUpdatedCategory(u: Category | Risk): u is Category {
    return 'children' in u && 'path' in u
  }
  public isUpdatedRisk(u: Category | Risk): u is Risk {
    return 'category' in u && 'impact' in u && 'likelihood' in u && 'type' in u
  }
}

export type { GraphMapper, MdxTranspiler }
export { newMapper }
