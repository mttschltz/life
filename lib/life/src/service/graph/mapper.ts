import type { Risk as UsecaseRisk } from '@life/usecase'
import { Category as GraphCategory, Risk as GraphRisk } from '@life/generated/graphql'
import { Category } from '@life'
import { Result, Results } from '@util'

class GraphMapper {
  risk({ id, category, name }: UsecaseRisk): Result<GraphRisk> {
    let graphCategory: GraphCategory
    switch (category) {
      case Category.Health:
        graphCategory = GraphCategory.Health
        break
      case Category.Wealth:
        graphCategory = GraphCategory.Wealth
        break
      case Category.Security:
        graphCategory = GraphCategory.Security
        break
      default:
        return Result.error('Unhandled category type')
    }
    return Result.success({
      category: graphCategory,
      id,
      name,
    })
  }

  risks(risks: UsecaseRisk[]): Results<GraphRisk> {
    return Results.new(risks.map(this.risk))
  }
}

export { GraphMapper }
