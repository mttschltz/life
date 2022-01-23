import type { Result, ResultError, ResultOk } from '@helper/result'

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

function mockThrows(msg: string): jest.Mock {
  return jest.fn().mockImplementation(() => {
    throw new Error(msg)
  })
}

export { assertResultError, assertResultOk, mockThrows }
