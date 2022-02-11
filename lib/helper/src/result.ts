interface ResultOk<T> {
  readonly ok: true
  readonly value: T
}

class ResultOkImpl<T> implements ResultOk<T> {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #value: T
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(value: T) {
    this.#value = value
  }

  public get ok(): true {
    return true
  }

  public get value(): T {
    return this.#value
  }
}

interface ResultError {
  readonly ok: false
  readonly error: Error
  readonly message: string
  readonly metadata: Record<string, unknown>
}

interface ResultMetadata {
  [key: string]: Date | ResultMetadata | boolean | number | string
}

class ResultErrorImpl implements ResultError {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #message: string
  #error: Error
  #metadata: ResultMetadata
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(message: string, error?: Error, metadata: ResultMetadata = {}) {
    this.#message = message
    this.#error = error ?? new Error('Result error')
    this.#metadata = metadata
  }

  public get ok(): false {
    return false
  }

  public get message(): string {
    return this.#message
  }

  public get error(): Error {
    return this.#error
  }

  public get metadata(): ResultMetadata {
    return this.#metadata
  }
}

type Result<T> = ResultError | ResultOk<T>

function resultOk<T>(value: T): Result<T> {
  return new ResultOkImpl<T>(value)
}

function resultError<T>(message: string, error?: Error, metadata?: ResultMetadata): Result<T> {
  return new ResultErrorImpl(message, error, metadata)
}

function isResultOk<T>(result: Result<T>): result is ResultOk<T> {
  return result.ok
}

function isResultError<T>(result: Result<T>): result is ResultError {
  return !result.ok
}

interface Results<T> {
  readonly values: (T | undefined)[]
  readonly okValues: T[]
  readonly firstErrorResult: ResultError | undefined
  withOnlyFirstError: <U = T>() => Results<U>
}

class ResultsImpl<T> implements Results<T> {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #results: Result<T>[]
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(rs: Result<T>[]) {
    this.#results = rs
  }

  public get firstErrorResult(): ResultError | undefined {
    return this.#results.find((r): r is ResultError => !r.ok)
  }

  public get values(): (T | undefined)[] {
    return this.#results.map((r) => (r.ok ? r.value : undefined))
  }

  public get okValues(): T[] {
    return this.#results.filter((r): r is ResultOk<T> => r.ok).map((r) => r.value)
  }

  public withOnlyFirstError<U = T>(): Results<U> {
    const firstErrorResult = this.firstErrorResult
    if (firstErrorResult) {
      return results([firstErrorResult])
    }
    return results([])
  }
}

function results<T>(rs: Result<T>[]): Results<T> {
  return new ResultsImpl(rs)
}

function resultsOk<T>(values: T[]): Results<T> {
  return new ResultsImpl(values.map((v) => resultOk(v)))
}

function resultsError<T>(message: string, error?: Error, metadata?: ResultMetadata): Results<T> {
  return new ResultsImpl([resultError(message, error, metadata)])
}

function resultsErrorResult<T>(err: ResultError): Results<T> {
  return new ResultsImpl([err])
}

export type { Result, ResultError, ResultOk, Results, ResultMetadata }
export { resultOk, resultError, resultsError, resultsErrorResult, results, resultsOk, isResultOk, isResultError }
