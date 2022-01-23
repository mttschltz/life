import { ResultError } from '@helper/result'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualResultError: (resultError: Omit<ResultError, 'error' | 'ok'> & Partial<Pick<ResultError, 'error'>>) => R
    }
  }
}

export {}
