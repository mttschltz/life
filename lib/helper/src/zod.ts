import { Result, resultError, ResultMetadata } from './result'
import { z } from 'zod'

interface ZodMetadata {
  errors: Omit<z.ZodIssue, 'path'>[]
  errorType: string
}

function resultZodError<T>(
  objectName: string,
  zodError: z.ZodError,
  metadata?: ResultMetadata & { [K in keyof ZodMetadata]?: never },
): Result<T> {
  const errors = zodError.issues.map((i) => ({ code: i.code, message: i.message, path: i.path }))
  const zodMetadata: ZodMetadata = {
    errors,
    errorType: 'ZodError',
  }

  const firstError = errors[0]
  const prop = firstError.path.length ? firstError.path.join('.') : null
  let firstErrorDescription
  if (prop) {
    firstErrorDescription = `Invalid prop ${prop} in ${objectName}: '${firstError.message}' (${firstError.code}).`
  } else {
    firstErrorDescription = `Invalid value for ${objectName}: '${firstError.message}' (${firstError.code}).`
  }

  const error = new Error(firstErrorDescription)
  return resultError(firstErrorDescription, error, { ...zodMetadata, ...metadata })
}

export { resultZodError }
