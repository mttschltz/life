import type { Risk as UsecaseRisk } from '@life/usecase/mapper'
import { Category as GraphCategory, Risk as GraphRisk } from '@life/__generated__/graphql'
import { Category } from '@life/risk'
import { Result, resultError, resultOk, results, Results } from '@util/result'

type MdxTranspiler = (mdx?: string) => string | undefined

interface GraphMapper {
  toCategory: (graphCategory: GraphCategory) => Result<Category>
  fromCategory: (category: Category) => Result<GraphCategory>
  fromRisk: ({ id, category, name, notes }: UsecaseRisk) => Result<GraphRisk>
  risks: (risks: UsecaseRisk[]) => Results<GraphRisk>
}

function newGraphMapper(mdxTranspiler: MdxTranspiler): GraphMapper {
  return new GraphMapperImpl(mdxTranspiler)
}

class GraphMapperImpl implements GraphMapper {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  //@ts-expect-error sdf
  #mdxTranspiler: MdxTranspiler
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(mdxTranspiler: MdxTranspiler) {
    this.#mdxTranspiler = mdxTranspiler
  }

  public toCategory(graphCategory: GraphCategory): Result<Category> {
    switch (graphCategory) {
      case GraphCategory.Health:
        return resultOk(Category.Health)
      case GraphCategory.Wealth:
        return resultOk(Category.Wealth)
      case GraphCategory.Security:
        return resultOk(Category.Security)
      default:
        return resultError('Unhandled category type')
    }
  }

  public fromCategory(category: Category): Result<GraphCategory> {
    switch (category) {
      case Category.Health:
        return resultOk(GraphCategory.Health)
      case Category.Wealth:
        return resultOk(GraphCategory.Wealth)
      case Category.Security:
        return resultOk(GraphCategory.Security)
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
      notes,
      // notes: this.#mdxTranspiler(notes),
    })
  }

  public risks(risks: UsecaseRisk[]): Results<GraphRisk> {
    return results(risks.map((risk) => this.fromRisk(risk)))
  }
}

export type { GraphMapper }
export { newGraphMapper }
