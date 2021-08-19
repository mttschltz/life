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

  public get value() {
    return this.#value
  }
}

interface ResultError {
  readonly ok: false
  readonly error?: Error
  readonly message: string
}

class ResultErrorImpl implements ResultError {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #message: string
  #error?: Error
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(message: string, error?: Error) {
    this.#message = message
    this.#error = error
  }

  public get ok(): false {
    return false
  }

  public get message() {
    return this.#message
  }

  public get error() {
    return this.#error
  }
}

type Result<T> = ResultOk<T> | ResultError

function resultOk<T>(value: T): Result<T> {
  return new ResultOkImpl<T>(value)
}

function resultError<T>(message: string, error?: Error): Result<T> {
  return new ResultErrorImpl(message, error)
}

interface Results<T> {
  readonly values: (T | undefined)[]
  readonly okValues: T[]
  readonly firstErrorResult: ResultError | undefined
}

class ResultsImpl<T> implements Results<T> {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #results: Result<T>[]
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(results: Result<T>[]) {
    this.#results = results
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
}

function results<T>(results: Result<T>[]): Results<T> {
  return new ResultsImpl(results)
}

export type { Result, ResultError, ResultOk, Results }
export { resultOk, resultError, results }
