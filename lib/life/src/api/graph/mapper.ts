import type { Risk as UsecaseRisk } from '@life/usecase/mapper'
import { CategoryTopLevel as GraphCategoryTopLevel, Risk as GraphRisk } from '@life/__generated__/graphql'
import { CategoryTopLevel } from '@life/risk'
import { Result, resultError, resultOk, results, Results } from '@util/result'

type MdxTranspiler = (mdx?: string) => string | undefined

interface GraphMapper {
  toCategory: (graphCategory: GraphCategoryTopLevel) => Result<CategoryTopLevel>
  fromCategory: (category: CategoryTopLevel) => Result<GraphCategoryTopLevel>
  fromRisk: ({ id, category, name, notes }: UsecaseRisk) => Result<GraphRisk>
  risks: (risks: UsecaseRisk[]) => Results<GraphRisk>
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

  public toCategory(graphCategory: GraphCategoryTopLevel): Result<CategoryTopLevel> {
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

  public fromCategory(category: CategoryTopLevel): Result<GraphCategoryTopLevel> {
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

  public fromRisk({ id, category, name, notes }: UsecaseRisk): Result<GraphRisk> {
    const graphCategoryResult = this.fromCategory(category)
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

  public risks(risks: UsecaseRisk[]): Results<GraphRisk> {
    return results(risks.map((risk) => this.fromRisk(risk)))
  }
}

export type { GraphMapper }
export { newGraphMapper }
