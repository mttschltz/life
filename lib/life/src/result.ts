export class Result<T> {
  public readonly errorMessage?: string
  public readonly isSuccess: boolean
  private readonly value?: T

  private constructor(isSuccess: boolean, errorMessage?: string, value?: T) {
    if (isSuccess && (value == null || errorMessage)) {
      throw new Error('Success results must have a value and no error message')
    }

    if (!isSuccess && (value != null || !errorMessage)) {
      throw new Error('Error results must have an error message and no value')
    }

    this.errorMessage = errorMessage
    this.isSuccess = isSuccess
    this.value = value
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value of an error result')
    }
    if (!this.value) {
      throw new Error('Missing value for success result')
    }
    return this.value
  }

  getErrorMessage(): string {
    if (this.isSuccess) {
      throw new Error('Cannot get error message of a success result')
    }
    if (!this.errorMessage) {
      throw new Error('Missing error message for error result')
    }
    return this.errorMessage
  }

  public static success<U>(value: U): Result<U> {
    return new Result<U>(true, undefined, value)
  }

  public static error<U>(errorMessage: string): Result<U> {
    return new Result<U>(true, errorMessage)
  }
}
