import { Result, resultError, ResultMetadata } from './result'
import { z } from 'zod'

interface ZodMetadata {
  errors: Omit<z.ZodIssue, 'path'>[]
  errorType: string
}

function resultZodError<T>(
  message: string,
  zodError: z.ZodError,
  metadata?: ResultMetadata & { [K in keyof ZodMetadata]?: never },
): Result<T> {
  const errors = zodError.issues.map((i) => ({ code: i.code, message: i.message }))
  const zodMetadata: ZodMetadata = {
    errors,
    errorType: 'ZodError',
  }

  const error = new Error(errors[0].message)
  return resultError(message, error, { ...zodMetadata, ...metadata })
}

export { resultZodError }
