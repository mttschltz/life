import { Result, resultOk } from '@helper/result'
import { resultZodError } from '@helper/zod'
import { z } from 'zod'

const IDENTIFIER_SCHEMA = z.object({
  __entity: z.literal('Identifier'),
  val: z.string().min(1),
})

function newIdentifier(id: string): Result<Identifier> {
  const result = IDENTIFIER_SCHEMA.shape.val.safeParse(id)
  if (!result.success) {
    return resultZodError('identifier', result.error, { id })
  }

  return resultOk({
    get __entity() {
      return 'Identifier' as const
    },
    get val() {
      return id
    },
  })
}

interface Identifier {
  readonly __entity: 'Identifier'
  readonly val: string
}

export type { Identifier }
export { newIdentifier, IDENTIFIER_SCHEMA }
