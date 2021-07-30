import type { Risk as UsecaseRisk } from '@life/usecase'
import { Category as GraphCategory, Risk as GraphRisk } from '@life/generated/graphql'
import { Category } from '@life'
import { Result, Results } from '@util'

class GraphMapper {
  toCategory(graphCategory: GraphCategory): Result<Category> {
    switch (graphCategory) {
      case GraphCategory.Health:
        return Result.success(Category.Health)
      case GraphCategory.Wealth:
        return Result.success(Category.Wealth)
      case GraphCategory.Security:
        return Result.success(Category.Security)
      default:
        return Result.error('Unhandled category type')
    }
  }

  fromCategory(category: Category): Result<GraphCategory> {
    switch (category) {
      case Category.Health:
        return Result.success(GraphCategory.Health)
      case Category.Wealth:
        return Result.success(GraphCategory.Wealth)
      case Category.Security:
        return Result.success(GraphCategory.Security)
      default:
        return Result.error('Unhandled category type')
    }
  }

  fromRisk({ id, category, name }: UsecaseRisk): Result<GraphRisk> {
    const graphCategoryResult = this.fromCategory(category)
    if (!graphCategoryResult.isSuccess()) {
      return Result.errorFrom(graphCategoryResult)
    }

    return Result.success({
      category: graphCategoryResult.getValue(),
      id,
      name,
    })
  }

  risks(risks: UsecaseRisk[]): Results<GraphRisk> {
    return Results.new(risks.map(this.fromRisk, this))
  }
}

export { GraphMapper }
