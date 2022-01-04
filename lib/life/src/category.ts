import { IsArray, IsDate, IsOptional, IsString, MinLength, validateSync } from 'class-validator'
import { Result, resultError, resultOk } from '@util/result'
import { Update } from './update'

// TODO: children can also be risks (Concerns)

interface Category extends Update {
  id: string
  path: string
  name: string
  description?: string
  children: Category[]
  parent?: Category
}

type CreateDetails = Pick<
  Category,
  'children' | 'description' | 'name' | 'parent' | 'path' | 'shortDescription' | 'updated'
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCategory(category: any): category is Category {
  return (
    !!category &&
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    category.id !== undefined &&
    category.path !== undefined &&
    category.name !== undefined &&
    category.children instanceof Array
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  )
}

function newCategory(id: string, details: CreateDetails): Result<Category> {
  // Parent
  if (typeof details.parent !== 'undefined' && !isCategory(details.parent)) {
    return resultError('parent must be a Category')
  }

  // Children
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!((details.children as any) instanceof Array) || details.children.some((c) => !isCategory(c))) {
    return resultError('children must be an array of Categorys')
  }
  const category = new CategoryImpl(details, id)

  // Primatives
  const errors = validateSync(category)
  if (errors.length > 0) {
    const constraints = errors[0].constraints
    if (!constraints) {
      return resultError('Validation failed')
    }
    return resultError(Object.values(constraints)[0])
  }

  return resultOk(category)
}

class CategoryImpl implements Category {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #id: string

  #path: string
  #name: string
  #description?: string
  #shortDescription: string
  #parent?: Category
  #children: Category[]
  #updated: Date
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(details: CreateDetails, id: string) {
    this.#id = id

    this.#path = details.path
    this.#name = details.name
    this.#description = details.description
    this.#shortDescription = details.shortDescription
    this.#parent = details.parent
    this.#children = details.children
    this.#updated = details.updated
  }

  @MinLength(1)
  @IsString()
  public get id(): string {
    return this.#id
  }

  // Details

  @MinLength(1)
  @IsString()
  public get path(): string {
    return this.#path
  }

  @MinLength(2)
  @IsString()
  public get name(): string {
    return this.#name
  }

  @MinLength(1)
  @IsString()
  @IsOptional()
  public get description(): string | undefined {
    return this.#description
  }

  @MinLength(1)
  @IsString()
  public get shortDescription(): string {
    return this.#shortDescription
  }

  @IsOptional()
  public get parent(): Category | undefined {
    return this.#parent
  }

  @IsOptional()
  @IsArray()
  public get children(): Category[] {
    return this.#children
  }

  @IsDate()
  public get updated(): Date {
    return this.#updated
  }
}

export type { Category, CreateDetails }
export { newCategory }
