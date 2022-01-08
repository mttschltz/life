import type {
  Risk as RiskUsecase,
  Category as CategoryUsecase,
  CategoryTopLevel as CategoryTopLevelUsecase,
} from '@life/usecase/mapper'
import { Category, CategoryTopLevel, Risk } from '@life/__generated__/graphql'
import { Result, resultError, resultOk, results, Results } from '@util/result'

type MdxTranspiler = (mdx?: string) => string | undefined

interface GraphMapper {
  toCategoryTopLevel: (graphCategory: CategoryTopLevel) => Result<CategoryTopLevelUsecase>
  fromCategoryTopLevel: (category: CategoryTopLevelUsecase) => Result<CategoryTopLevel>
  fromRisk: ({ id, category, name, notes }: RiskUsecase) => Result<Risk>
  risks: (risks: RiskUsecase[]) => Results<Risk>
  categoryFromUsecase: (category: CategoryUsecase) => Result<Category>
  categoriesFromUsecase: (categories: CategoryUsecase[]) => Results<Category>
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

  public toCategoryTopLevel(graphCategory: CategoryTopLevel): Result<CategoryTopLevelUsecase> {
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

  public fromCategoryTopLevel(category: CategoryTopLevelUsecase): Result<CategoryTopLevel> {
    switch (category) {
      case 'Health':
        return resultOk(CategoryTopLevel.Health)
      case 'Wealth':
        return resultOk(CategoryTopLevel.Wealth)
      case 'Security':
        return resultOk(CategoryTopLevel.Security)
    }
  }

  public fromRisk({ id, category, name, notes }: RiskUsecase): Result<Risk> {
    const graphCategoryResult = this.fromCategoryTopLevel(category)
    if (!graphCategoryResult.ok) {
      return graphCategoryResult
    }

    return resultOk({
      category: graphCategoryResult.value,
      id,
      name,
      notes: this.#mdxTranspiler(notes),
    })
  }

  public risks(risks: RiskUsecase[]): Results<Risk> {
    return results(risks.map((risk) => this.fromRisk(risk)))
  }
}

export type { GraphMapper, MdxTranspiler }
export { newMapper }
