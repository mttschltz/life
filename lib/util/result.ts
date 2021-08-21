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

  public get message(): string {
    return this.#message
  }

  public get error(): Error | undefined {
    return this.#error
  }
}

type Result<T> = ResultError | ResultOk<T>

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
}

function results<T>(rs: Result<T>[]): Results<T> {
  return new ResultsImpl(rs)
}

export type { Result, ResultError, ResultOk, Results }
export { resultOk, resultError, results }
