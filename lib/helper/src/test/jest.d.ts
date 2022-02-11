import { ResultError } from '@helper/result'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualResultError: (
        resultError: Omit<ResultError, 'error' | 'metadata' | 'ok'> & Partial<Pick<ResultError, 'error' | 'metadata'>>,
      ) => R
    }
  }
}

export {}
