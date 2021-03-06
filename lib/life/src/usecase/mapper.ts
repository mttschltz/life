import {
  CategoryTopLevel as CategoryTopLevelDomain,
  CreateDetails as CreateDetailsDomain,
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
import { Result, resultError, resultOk, results, Results } from '@helper/result'
import { CreateRiskRequest } from './risk/createRisk'

type RiskType = 'Condition' | 'Goal' | 'Risk'

type Impact = 'High' | 'Normal'

type Likelihood = 'High' | 'Normal'

type CategoryTopLevel = 'Health' | 'Security' | 'Wealth'

type Risk = Pick<RiskDomain, 'name' | 'notes' | 'shortDescription' | 'updated'> & {
  id: string
  category: CategoryTopLevel
  impact: Impact
  likelihood: Likelihood
  parent?: Risk
  type: RiskType
}

interface RiskMapper {
  risk: (risk: RiskDomain) => Risk
  risks: (risks: RiskDomain[]) => Risk[]
  createDetails: (request: RiskCreateDetails) => CreateDetailsDomain
}

// no need for risk tests until they are refactored
/* istanbul ignore next */
function newRiskMapper(): RiskMapper {
  return new RiskMapperImpl()
}

type RiskCreateDetails = Omit<CreateRiskRequest, 'parentId'> & { parent?: RiskDomain }

class RiskMapperImpl implements RiskMapper {
  // no need for risk tests until they are refactored
  /* istanbul ignore next */
  public createDetails(request: RiskCreateDetails): CreateDetailsDomain {
    let category: CategoryTopLevelDomain
    switch (request.category) {
      case 'Health':
        category = CategoryTopLevelDomain.Health
        break
      case 'Wealth':
        category = CategoryTopLevelDomain.Wealth
        break
      case 'Security':
        category = CategoryTopLevelDomain.Security
        break
    }

    let riskType: RiskTypeDomain
    switch (request.type) {
      case 'Condition':
        riskType = RiskTypeDomain.Condition
        break
      case 'Goal':
        riskType = RiskTypeDomain.Goal
        break
      case 'Risk':
        riskType = RiskTypeDomain.Risk
        break
    }

    let likelihood: LikelihoodDomain
    switch (request.likelihood) {
      case 'High':
        likelihood = LikelihoodDomain.High
        break
      case 'Normal':
        likelihood = LikelihoodDomain.Normal
        break
    }

    let impact: ImpactDomain
    switch (request.impact) {
      case 'High':
        impact = ImpactDomain.High
        break
      case 'Normal':
        impact = ImpactDomain.Normal
        break
    }

    return {
      category,
      impact,
      likelihood,
      name: request.name,
      shortDescription: request.shortDescription,
      type: riskType,
      updated: request.updated,
      notes: request.notes,
      parent: request.parent,
    }
  }

  // no need for risk tests until they are refactored
  /* istanbul ignore next */
  public risk(risk: RiskDomain): Risk {
    let usecaseParent
    if (risk.parent) {
      usecaseParent = this.risk(risk.parent)
    }

    let category: CategoryTopLevel
    switch (risk.category) {
      case CategoryTopLevelDomain.Health:
        category = 'Health'
        break
      case CategoryTopLevelDomain.Security:
        category = 'Security'
        break
      case CategoryTopLevelDomain.Wealth:
        category = 'Wealth'
        break
    }

    let riskType: RiskType
    switch (risk.type) {
      case RiskTypeDomain.Condition:
        riskType = 'Condition'
        break
      case RiskTypeDomain.Goal:
        riskType = 'Goal'
        break
      case RiskTypeDomain.Risk:
        riskType = 'Risk'
        break
    }

    let likelihood: Likelihood
    switch (risk.likelihood) {
      case LikelihoodDomain.High:
        likelihood = 'High'
        break
      case LikelihoodDomain.Normal:
        likelihood = 'Normal'
        break
    }

    let impact: Impact
    switch (risk.impact) {
      case ImpactDomain.High:
        impact = 'High'
        break
      case ImpactDomain.Normal:
        impact = 'Normal'
        break
    }

    return {
      id: risk.id.val,
      category,
      impact,
      likelihood,
      name: risk.name,
      notes: risk.notes,
      shortDescription: risk.shortDescription,
      parent: usecaseParent,
      type: riskType,
      updated: risk.updated,
    }
  }

  // no need for risk tests until they are refactored
  /* istanbul ignore next */
  public risks(risks: RiskDomain[]): Risk[] {
    return risks.map((risk) => this.risk(risk))
  }
}

type Category = Pick<
  CategoryDomain,
  'description' | 'name' | 'path' | 'previousPaths' | 'previousSlugs' | 'shortDescription' | 'slug' | 'updated'
> & {
  id: string
  children: Category[]
  parent?: Category
}

interface CategoryMapper {
  category: (c: CategoryDomain) => Category
  categories: (categories: CategoryDomain[]) => Category[]
}

function newCategoryMapper(): CategoryMapper {
  return new CategoryMapperImpl()
}

class CategoryMapperImpl implements CategoryMapper {
  public category(category: CategoryDomain): Category {
    let parent
    if (category.parent) {
      parent = this.category(category.parent)
    }

    return {
      id: category.id.val,
      name: category.name,
      slug: category.slug,
      previousSlugs: [...category.previousSlugs],
      description: category.description,
      shortDescription: category.shortDescription,
      parent: parent,
      children: category.children.map((c2) => this.category(c2)),
      updated: category.updated,
      path: category.path,
      previousPaths: [...category.previousPaths],
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
  return 'children' in u && 'slug' in u && 'previousSlugs' in u
}

function isUpdatedRisk(u: Updated): u is Risk {
  return 'category' in u && 'impact' in u && 'likelihood' in u && 'type' in u
}

export { newCategoryMapper, newRiskMapper, newUpdatedMapper, isUpdatedCategory, isUpdatedRisk }
export type {
  RiskType,
  Impact,
  Likelihood,
  CategoryTopLevel,
  Risk,
  RiskMapper,
  Category,
  CategoryMapper,
  UpdatedMapper,
  Updated,
  RiskCreateDetails,
}
