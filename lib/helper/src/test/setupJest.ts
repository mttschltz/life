import { ResultError } from '@helper/result'
import { diff } from 'jest-diff'

function toEqualResultError(
  this: Pick<jest.MatcherContext, 'equals'>,
  received: ResultError,
  expected: Omit<ResultError, 'error' | 'metadata' | 'ok'> & Partial<Pick<ResultError, 'error' | 'metadata'>>,
): jest.CustomMatcherResult {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (received.ok) {
    return {
      message: (): string => `expected error to have property 'ok: true'`,
      pass: false,
    }
  }
  if (received.message !== expected.message) {
    return {
      message: (): string =>
        `expected messages to match\n\nexpected message: "${expected.message}"\nreceived message: "${received.message}"`,
      pass: false,
    }
  }
  if (!this.equals(received.error, expected.error || new Error('Result error'))) {
    return {
      message: (): string =>
        `expected errors to match\n\n${diff(expected.error ?? new Error('Result error'), received.error) ?? ''}`,
      pass: false,
    }
  }

  if (!this.equals(received.metadata, expected.metadata ?? {})) {
    return {
      message: (): string => `expected metadata to match\n\n${diff(expected.metadata, received.metadata) ?? ''}`,
      pass: false,
    }
  }

  return {
    message: (): string => `expected error result not to equal error result`,
    pass: true,
  }
}

expect.extend({
  toEqualResultError,
})

export { toEqualResultError }
