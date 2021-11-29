import { CategoryTopLevel, Impact, Likelihood, Risk as RiskDomain, RiskType } from '@life/risk'
import { Category as CategoryDomain } from '@life/category'

interface Risk {
  id: string

  category: CategoryTopLevel
  impact: Impact
  likelihood: Likelihood

  name: string
  notes?: string
  parent?: Risk
  type: RiskType
}

class RiskMapper {
  public risk({ id, category, impact, likelihood, name, notes, parent, type }: RiskDomain): Risk {
    let usecaseParent
    if (parent) {
      usecaseParent = this.risk(parent)
    }
    return {
      id,
      category,
      impact,
      likelihood,
      name,
      notes,
      parent: usecaseParent,
      type,
    }
  }

  public risks(risks: RiskDomain[]): Risk[] {
    return risks.map((risk) => this.risk(risk))
  }
}

type Category = Pick<CategoryDomain, 'description' | 'id' | 'name' | 'path'> & {
  children: Category[]
  parent?: Category
}

class CategoryMapper {
  public category(c: CategoryDomain): Category {
    let parent
    if (c.parent) {
      parent = this.category(c.parent)
    }

    return {
      id: c.id,
      name: c.name,
      path: c.path,
      description: c.description,
      parent: parent,
      children: c.children.map((c2) => this.category(c2)),
    }
  }

  public categories(categories: CategoryDomain[]): Category[] {
    return categories.map((c) => this.category(c))
  }
}

export { RiskMapper, CategoryMapper }
export type { Risk, Category }
