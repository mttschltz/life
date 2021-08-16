import type { Risk as UsecaseRisk } from '@life/usecase'
import { Category as GraphCategory, Risk as GraphRisk } from '@life/__generated__/graphql'
import { Category } from '@life'
import { Result, resultError, resultErrorFrom, resultOk, results, Results } from '@util'

class GraphMapper {
  toCategory(graphCategory: GraphCategory): Result<Category> {
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

  fromCategory(category: Category): Result<GraphCategory> {
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

  fromRisk({ id, category, name }: UsecaseRisk): Result<GraphRisk> {
    const graphCategoryResult = this.fromCategory(category)
    if (!graphCategoryResult.ok) {
      return resultErrorFrom(graphCategoryResult)
    }

    return resultOk({
      category: graphCategoryResult.value,
      id,
      name,
    })
  }

  risks(risks: UsecaseRisk[]): Results<GraphRisk> {
    return results(risks.map(this.fromRisk, this))
  }
}

export { GraphMapper }
