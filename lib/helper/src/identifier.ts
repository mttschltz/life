import { z } from 'zod'
import { Result, resultOk } from './result'
import { resultZodError } from './zod'

const identifierSchema = z.object({
  val: z.string().min(1),
})

function newIdentifier(id: string): Result<Identifier> {
  const result = identifierSchema.shape.val.safeParse(id)
  if (!result.success) {
    return resultZodError('Invalid identifier', result.error, { id })
  }

  return resultOk({
    get val() {
      return id
    },
  })
}

interface Identifier {
  readonly val: string
}

export type { Identifier }
export { newIdentifier }
