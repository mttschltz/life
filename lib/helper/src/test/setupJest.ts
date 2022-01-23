import { ResultError } from '@helper/result'

function toEqualResultError(
  this: Pick<jest.MatcherContext, 'equals'>,
  received: ResultError,
  expected: Omit<ResultError, 'error' | 'ok'> & Partial<Pick<ResultError, 'error'>>,
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
      message: (): string => `expected errors to match`,
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
