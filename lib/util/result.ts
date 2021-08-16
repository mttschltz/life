interface OkResult<T> {
  value: T
}

interface ErrorResult {
  error?: Error
  message: string
}

interface Result<T> {
  readonly ok: boolean
  readonly value: T
  readonly error?: Error
  readonly errorMessage?: string
}

class ResultImpl<T> implements Result<T> {
  #ok?: OkResult<T>
  #error?: ErrorResult

  constructor(ok?: OkResult<T>, error?: ErrorResult) {
    if (ok && error) {
      throw new Error('Only one ok or one error must be provided')
    }
    if (!ok && !error) {
      throw new Error('Either a ok or error must be provided')
    }

    if (ok) {
      this.#ok = ok
    }
    if (error) {
      const errorObj = error.error || new Error(error.message)
      this.#error = {
        ...error,
        error: errorObj,
      }
    }
  }

  get ok(): boolean {
    return !!this.#ok
  }

  get value(): T {
    if (!this.#ok) {
      throw new Error('Cannot get value of an error result')
    }
    return this.#ok.value
  }

  get error(): Error | undefined {
    if (!this.#error) {
      throw new Error('Cannot get error of an ok result')
    }
    return this.#error.error
  }

  get errorMessage(): string {
    if (!this.#error) {
      throw new Error('Cannot get error message of an ok result')
    }
    return this.#error.message
  }
}

function resultOk<T>(value: T): Result<T> {
  return new ResultImpl<T>({ value }, undefined)
}

function resultError<T>(message: string, error?: Error): Result<T> {
  return new ResultImpl<T>(undefined, { message, error })
}

function resultErrorFrom<U, V>(result: Result<V>): Result<U> {
  if (result.ok || !result.errorMessage) {
    throw new Error('Cannot create error from non-error result')
  }
  return resultError(result.errorMessage, result.error)
}

interface Results<T> {
  values: (T | undefined)[]
  okValues: T[]
  firstErrorResult: Result<T> | undefined
}

class ResultsImpl<T> implements Results<T> {
  #results: Result<T>[]

  constructor(results: Result<T>[]) {
    this.#results = results
  }

  get firstErrorResult(): Result<T> | undefined {
    return this.#results.find((r) => !r.ok)
  }

  get values(): (T | undefined)[] {
    return this.#results.map((r) => (r.ok ? r.value : undefined))
  }

  get okValues(): T[] {
    return this.#results.filter((r) => r.ok).map((r) => r.value)
  }
}

function results<T>(results: Result<T>[]): Results<T> {
  return new ResultsImpl(results)
}

export type { Result, Results }
export { resultOk as resultOk, resultError as resultError, results, resultErrorFrom }
