import { Result, resultOk } from '@helper/result'
import { Updatable } from './updated'
import { z } from 'zod'
import { Identifier } from '@helper/identifier'
import { resultZodError } from '@helper/zod'
import { EntitySchema } from '@helper/entity'

// TODO: children can also be risks (Concerns)

interface Category extends Updatable {
  readonly __entity: 'Category'
  readonly id: Identifier
  readonly slug: string
  readonly previousSlugs: string[]
  readonly name: string
  readonly description?: string
  readonly children: Category[]
  readonly parent?: Category
  readonly updated: Date
  readonly shortDescription: string
}

type CategoryValidationSchema = EntitySchema<Category>

const CATEGORY_SCHEMA: z.ZodSchema<CategoryValidationSchema> = z.lazy(() =>
  z
    .object({
      __entity: z.literal('Category'),
      id: z.object({ __entity: z.literal('Identifier') }),
      slug: z.string().min(1),
      previousSlugs: z.array(z.string().min(1)),
      name: z.string().min(2),
      description: z.string().min(2).optional(),
      children: z.array(z.object({ __entity: z.literal('Category') })),
      parent: z.object({ __entity: z.literal('Category') }).optional(),
      updated: z.date(),
      shortDescription: z.string().min(2),
    })
    .strict(),
)

function isCategory(category: unknown): category is Category {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (category as Category)?.__entity === 'Category'
}

type CreateDetails = Omit<Category, '__entity'>

function newCategory(details: CreateDetails): Result<Category> {
  const category: Category = {
    get __entity() {
      return 'Category' as const
    },
    get children() {
      return details.children
    },
    get id() {
      return details.id
    },
    get slug() {
      return details.slug
    },
    get previousSlugs() {
      return details.previousSlugs
    },
    get name() {
      return details.name
    },
    get description() {
      return details.description
    },
    get parent() {
      return details.parent
    },
    get updated() {
      return details.updated
    },
    get shortDescription() {
      return details.shortDescription
    },
  }

  const parseResult = CATEGORY_SCHEMA.safeParse(category)
  if (!parseResult.success) {
    return resultZodError('category', parseResult.error, {
      category: {
        id: category.id.val,
        name: category.name,
      },
    })
  }

  return resultOk(category)
}

export type { Category, CreateDetails }
export { newCategory, isCategory }
