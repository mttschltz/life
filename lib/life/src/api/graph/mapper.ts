import type { Risk as RiskUsecase, Category as CategoryUsecase } from '@life/usecase/mapper'
import { Category, CategoryTopLevel as GraphCategoryTopLevel, Risk as GraphRisk } from '@life/__generated__/graphql'
import { CategoryTopLevel } from '@life/risk'
import { Result, resultError, resultOk, results, Results } from '@util/result'

type MdxTranspiler = (mdx?: string) => string | undefined

interface GraphMapper {
  toCategoryTopLevel: (graphCategory: GraphCategoryTopLevel) => Result<CategoryTopLevel>
  fromCategoryTopLevel: (category: CategoryTopLevel) => Result<GraphCategoryTopLevel>
  fromRisk: ({ id, category, name, notes }: RiskUsecase) => Result<GraphRisk>
  risks: (risks: RiskUsecase[]) => Results<GraphRisk>
  categoryFromUsecase: (category: CategoryUsecase) => Result<Category>
  categoriesFromUsecase: (categories: CategoryUsecase[]) => Results<Category>
}

function newGraphMapper(mdxTranspiler: MdxTranspiler): GraphMapper {
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

  public toCategoryTopLevel(graphCategory: GraphCategoryTopLevel): Result<CategoryTopLevel> {
    switch (graphCategory) {
      case GraphCategoryTopLevel.Health:
        return resultOk(CategoryTopLevel.Health)
      case GraphCategoryTopLevel.Wealth:
        return resultOk(CategoryTopLevel.Wealth)
      case GraphCategoryTopLevel.Security:
        return resultOk(CategoryTopLevel.Security)
      default:
        return resultError('Unhandled category type')
    }
  }

  public fromCategoryTopLevel(category: CategoryTopLevel): Result<GraphCategoryTopLevel> {
    switch (category) {
      case CategoryTopLevel.Health:
        return resultOk(GraphCategoryTopLevel.Health)
      case CategoryTopLevel.Wealth:
        return resultOk(GraphCategoryTopLevel.Wealth)
      case CategoryTopLevel.Security:
        return resultOk(GraphCategoryTopLevel.Security)
      default:
        return resultError('Unhandled category type')
    }
  }

  public fromRisk({ id, category, name, notes, shortDescription, updated }: RiskUsecase): Result<GraphRisk> {
    const graphCategoryResult = this.fromCategoryTopLevel(category)
    if (!graphCategoryResult.ok) {
      return graphCategoryResult
    }

    return resultOk({
      category: graphCategoryResult.value,
      id,
      name,
      notes: this.#mdxTranspiler(notes),
      shortDescription,
      updated,
    })
  }

  public risks(risks: RiskUsecase[]): Results<GraphRisk> {
    return results(risks.map((risk) => this.fromRisk(risk)))
  }
}

export type { GraphMapper, MdxTranspiler }
export { newGraphMapper }
