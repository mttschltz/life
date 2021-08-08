class Results<T> {
  #results: Result<T>[]

  private constructor(results: Result<T>[]) {
    this.#results = results
  }

  firstErrorResult(): Result<T> | undefined {
    return this.#results.find((r) => !r.isSuccess())
  }

  getValues(): T[] {
    return this.#results.map((r) => r.getValue())
  }

  public static new<U>(results: Result<U>[]): Results<U> {
    return new Results(results)
  }
}

interface SuccessResult<T> {
  value: T
}

interface ErrorResult {
  error?: Error
  message: string
}

class Result<T> {
  #success?: SuccessResult<T>
  #error?: ErrorResult

  private constructor(success?: SuccessResult<T>, error?: ErrorResult) {
    if (success && error) {
      throw new Error('Only one success or one error must be provided')
    }
    if (!success && !error) {
      throw new Error('Either a success or error must be provided')
    }

    if (success) {
      this.#success = success
    }
    if (error) {
      const errorObj = error.error || new Error(error.message)
      this.#error = {
        ...error,
        error: errorObj,
      }
    }
  }

  isSuccess(): boolean {
    return !!this.#success
  }

  getValue(): T {
    if (!this.#success) {
      throw new Error('Cannot get value of an error result')
    }
    return this.#success.value
  }

  getError(): Error | undefined {
    if (!this.#error) {
      throw new Error('Cannot get error of a success result')
    }
    return this.#error.error
  }

  getErrorMessage(): string {
    if (!this.#error) {
      throw new Error('Cannot get error message of a success result')
    }
    return this.#error.message
  }

  public static success<U>(value: U): Result<U> {
    return new Result<U>({ value }, undefined)
  }

  public static error<U>(message: string, error?: Error): Result<U> {
    return new Result<U>(undefined, { message, error })
  }

  public static errorFrom<U, V>(result: Result<V>): Result<U> {
    if (result.isSuccess()) {
      throw new Error('Cannot create error from non-error result')
    }
    return Result.error(result.getErrorMessage())
  }

  public static firstErrorResult<U>(result: Result<U>[]): Result<U> | undefined {
    return result.find((r) => !r.isSuccess())
  }
}

export { Result, Results }
