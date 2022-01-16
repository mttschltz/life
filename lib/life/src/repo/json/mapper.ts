import { Category, CreateDetails as CategoryCreateDetails, newCategory } from '@life/category'
import { Risk, newRisk } from '@life/risk'
import { Result } from '@util/result'

type RiskJson = Omit<Risk, 'mitigations' | 'parent'> & { parentId?: string }
type CategoryJson = Omit<Category, 'children' | 'parent'> & { parentId?: string; children: string[] }

// ignore code coverage for risks until they are refactored
/* c8 ignore start */
class RiskMapper {
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
      id,
      impact,
      likelihood,
      name,
      notes,
      type,
      parentId: parent?.id,
      shortDescription,
      updated,
    }
  }

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
    return newRisk(id, createDetails)
  }
}
/* c8 ignore stop */

interface CategoryMapper {
  toJson: (category: Category) => CategoryJson
  fromJson: (categoryJson: CategoryJson, parent: Category | undefined, children: Category[]) => Result<Category>
}

function newCategoryMapper(): CategoryMapper {
  return new CategoryMapperImpl()
}

class CategoryMapperImpl implements CategoryMapper {
  public toJson({ id, name, parent, path, description, shortDescription, children, updated }: Category): CategoryJson {
    return {
      id,
      name,
      parentId: parent?.id,
      path,
      description,
      shortDescription,
      children: children.map((c) => c.id),
      updated,
    }
  }

  public fromJson(
    { id, name, description, path, shortDescription, updated }: CategoryJson,
    parent: Category | undefined,
    children: Category[],
  ): Result<Category> {
    const createDetails: CategoryCreateDetails = {
      name,
      parent,
      children,
      path,
      description,
      shortDescription,
      updated,
    }
    return newCategory(id, createDetails)
  }
}

export type { RiskJson, CategoryJson, CategoryMapper }
export { RiskMapper, newCategoryMapper }
