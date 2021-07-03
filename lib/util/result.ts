export class Result<T> {
  public readonly isSuccess: boolean

  #error?: Error
  #errorMessage?: string
  #value?: T

  private constructor(isSuccess: boolean, errorMessage?: string, error?: Error, value?: T) {
    if (isSuccess && (errorMessage || error)) {
      throw new Error('Success results must not have an error message or error')
    }

    if (!isSuccess && (value || !errorMessage)) {
      throw new Error('Error results must have an error message and no value')
    }

    this.isSuccess = isSuccess

    if (isSuccess) {
      this.#value = value
    } else {
      this.#errorMessage = errorMessage
      this.#error ||= new Error()
    }
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value of an error result')
    }
    if (!this.#value) {
      throw new Error('Missing value for success result')
    }
    return this.#value
  }

  getError(): Error {
    if (this.isSuccess) {
      throw new Error('Cannot get error message of a success result')
    }
    if (!this.#error) {
      throw new Error('Missing error message for error result')
    }
    return this.#error
  }

  getErrorMessage(): string {
    if (this.isSuccess) {
      throw new Error('Cannot get error message of a success result')
    }
    if (!this.#errorMessage) {
      throw new Error('Missing error message for error result')
    }
    return this.#errorMessage
  }

  public static success<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, undefined, value)
  }

  public static error<U>(errorMessage: string, error?: Error): Result<U> {
    return new Result<U>(false, errorMessage, error)
  }

  public static errorFrom<U, V>(result: Result<V>): Result<U> {
    if (result.isSuccess) {
      throw new Error('Cannot create error from non-error result')
    }
    return Result.error(result.getErrorMessage())
  }
}
