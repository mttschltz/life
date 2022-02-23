import { Category, CreateDetails as CategoryCreateDetails, newCategory } from '@life/category'
import { Risk, newRisk } from '@life/risk'
import { Result } from '@helper/result'
import { newIdentifier } from '@helper/identifier'

type RiskJson = Omit<Risk, '__entity' | 'id' | 'mitigations' | 'parent'> & { id: string; parentId?: string }
type CategoryJson = Omit<Category, '__entity' | 'children' | 'id' | 'parent'> & {
  id: string
  parentId?: string
  children: string[]
}

class RiskMapper {
  // ignore code coverage for risks until they are refactored
  /* istanbul ignore next */
  public toJson({
    category,
    id,
    impact,
    likelihood,
    name,
    notes,
    parent,
    type,
    shortDescription,
    updated,
  }: Risk): RiskJson {
    return {
      category,
      id: id.val,
      impact,
      likelihood,
      name,
      notes,
      type,
      parentId: parent?.id.val,
      shortDescription,
      updated,
    }
  }

  // ignore code coverage for risks until they are refactored
  /* istanbul ignore next */
  public fromJson(
    { id, category, impact, likelihood, name, notes, type, shortDescription, updated }: RiskJson,
    parent: Risk | undefined,
  ): Result<Risk> {
    const createDetails = {
      category,
      impact,
      likelihood,
      name,
      notes,
      type,
      parent,
      shortDescription,
      updated,
    }

    const idResult = newIdentifier(id)
    if (!idResult.ok) {
      return idResult
    }

    return newRisk(idResult.value, createDetails)
  }
}

interface CategoryMapper {
  toJson: (category: Category) => CategoryJson
  fromJson: (categoryJson: CategoryJson, parent: Category | undefined, children: Category[]) => Result<Category>
}

function newCategoryMapper(): CategoryMapper {
  return new CategoryMapperImpl()
}

class CategoryMapperImpl implements CategoryMapper {
  public toJson({
    id,
    name,
    parent,
    slug,
    previousSlugs,
    path,
    previousPaths,
    description,
    shortDescription,
    children,
    updated,
  }: Category): CategoryJson {
    return {
      id: id.val,
      name,
      parentId: parent?.id.val,
      slug,
      previousSlugs: [...previousSlugs],
      path,
      previousPaths: [...previousPaths],
      description,
      shortDescription,
      children: children.map((c) => c.id.val),
      updated,
    }
  }

  public fromJson(category: CategoryJson, parent: Category | undefined, children: Category[]): Result<Category> {
    const idResult = newIdentifier(category.id)
    if (!idResult.ok) {
      return idResult
    }

    const createDetails: CategoryCreateDetails = {
      id: idResult.value,
      name: category.name,
      parent,
      children,
      slug: category.slug,
      previousSlugs: [...category.previousSlugs],
      path: category.path,
      previousPaths: [...category.previousPaths],
      description: category.description,
      shortDescription: category.shortDescription,
      updated: category.updated,
    }
    const result = newCategory(createDetails)
    return result
  }
}

export type { RiskJson, CategoryJson, CategoryMapper }
export { RiskMapper, newCategoryMapper }
