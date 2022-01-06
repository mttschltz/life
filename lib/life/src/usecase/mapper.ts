import {
  CategoryTopLevel as CategoryTopLevelDomain,
  Impact as ImpactDomain,
  Likelihood as LikelihoodDomain,
  Risk as RiskDomain,
  RiskType as RiskTypeDomain,
} from '@life/risk'
import { Category as CategoryDomain } from '@life/category'
import {
  isUpdatedCategory as isUpdatedCategoryDomain,
  isUpdatedRisk as isUpdatedRiskDomain,
  Updated as UpdatedDomain,
} from '@life/updated'
import { Result, resultError, resultOk, results, Results } from '@util/result'

type CategoryTopLevel = CategoryTopLevelDomain
type Impact = ImpactDomain
type Likelihood = LikelihoodDomain
type RiskType = RiskTypeDomain
type Risk = Pick<RiskDomain, 'id' | 'name' | 'notes' | 'shortDescription' | 'updated'> & {
  category: CategoryTopLevel
  impact: Impact
  likelihood: Likelihood
  parent?: Risk
  type: RiskType
}

class RiskMapper {
  public risk({
    id,
    category,
    impact,
    likelihood,
    name,
    notes,
    parent,
    shortDescription,
    type,
    updated,
  }: RiskDomain): Risk {
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
      shortDescription,
      parent: usecaseParent,
      type,
      updated,
    }
  }

  public risks(risks: RiskDomain[]): Risk[] {
    return risks.map((risk) => this.risk(risk))
  }
}

type Category = Pick<CategoryDomain, 'description' | 'id' | 'name' | 'path' | 'shortDescription' | 'updated'> & {
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
      shortDescription: c.shortDescription,
      parent: parent,
      children: c.children.map((c2) => this.category(c2)),
      updated: c.updated,
    }
  }

  public categories(categories: CategoryDomain[]): Category[] {
    return categories.map((c) => this.category(c))
  }
}

type Updated = Category | Risk

interface UpdatedMapper {
  updated: (updated: UpdatedDomain[]) => Results<Updated>
}

class UpdatedMapperImpl implements UpdatedMapper {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #categoryMapper: CategoryMapper
  #riskMapper: RiskMapper
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(categoryMapper: CategoryMapper, riskMapper: RiskMapper) {
    this.#categoryMapper = categoryMapper
    this.#riskMapper = riskMapper
  }

  public updated(updated: UpdatedDomain[]): Results<Updated> {
    const updatedResults: Result<Updated>[] = updated.map((u) => {
      if (isUpdatedCategoryDomain(u)) {
        return resultOk(this.#categoryMapper.category(u))
      } else if (isUpdatedRiskDomain(u)) {
        return resultOk<Risk>(this.#riskMapper.risk(u))
      }
      return resultError('Unhandled Updated type')
    })
    return results(updatedResults)
  }
}

function newUpdatedMapper(categoryMapper: CategoryMapper, riskMapper: RiskMapper): UpdatedMapper {
  return new UpdatedMapperImpl(categoryMapper, riskMapper)
}

function isUpdatedCategory(u: Updated): u is Category {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return 'children' in u && 'parent' in u && 'path' in u
}

function isUpdatedRisk(u: Updated): u is Risk {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return 'category' in u && 'impact' in u && 'likelihood' in u && 'type' in u
}

export { RiskMapper, CategoryMapper, newUpdatedMapper, isUpdatedCategory, isUpdatedRisk }
export type { Risk, Category, UpdatedMapper, Updated }
