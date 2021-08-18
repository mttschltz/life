import type { Result, ResultError, ResultOk } from '@util/result'

function assertResultError<T>(result: Result<T>): asserts result is ResultError {
  if (result.ok) {
    throw new Error('Not a ResultError')
  }
}

function assertResultOk<T>(result: Result<T>): asserts result is ResultOk<T> {
  if (!result.ok) {
    throw new Error('Not a ResultOk')
  }
}

export { assertResultError, assertResultOk }