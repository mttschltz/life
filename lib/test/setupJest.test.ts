import { ResultError, resultError, resultOk } from '@util/result'
import { assertResultError } from '@util/testing'
import { toEqualResultError } from './setupJest'

type Expected = Parameters<typeof toEqualResultError>[1]

describe('toEqualResultError', () => {
  describe("Given a received result that's not an error", () => {
    test('Then it fails', () => {
      const expected: Expected = {
        message: 'expected',
      }
      const received = resultOk<unknown>('received')
      const equals = jest.fn().mockReturnValueOnce(true)

      const result = toEqualResultError.call({ equals }, received as ResultError, expected)

      expect(result.pass).toEqual(false)
      expect(result.message()).toEqual(`expected error to have property 'ok: true'`)
      expect(equals.mock.calls).toHaveLength(0)
    })
    test('Then it passes as a Jest matcher with called with .not', () => {
      const expected: Expected = {
        message: 'expected',
      }
      const received = resultOk<unknown>('received')

      expect(received).not.toEqualResultError(expected)
    })
  })
  describe('Given an expected error result without an error', () => {
    describe('When the received error result is initialized without an error', () => {
      describe('and the messages match', () => {
        test('Then it passes', () => {
          const expected: Expected = {
            message: 'message',
          }
          const received = resultError('message')
          assertResultError(received)
          const equals = jest.fn().mockReturnValueOnce(true)

          const result = toEqualResultError.call({ equals }, received, expected)

          expect(result.pass).toEqual(true)
          expect(result.message()).toEqual(`expected error result not to equal error result`)
          expect(equals.mock.calls).toHaveLength(1)
          expect(equals.mock.calls[0]).toEqual([received.error, new Error('Result error')])
        })
        test('Then it passes as a Jest matcher', () => {
          const expected: Expected = {
            message: 'message',
          }
          const received = resultError('message')
          assertResultError(received)

          expect(received).toEqualResultError(expected)
        })
      })
      describe('and the messages do not match', () => {
        test('Then it fails', () => {
          const expected: Expected = {
            message: 'expected',
          }
          const received = resultError('received')
          assertResultError(received)
          const equals = jest.fn().mockReturnValueOnce(true)

          const result = toEqualResultError.call({ equals }, received, expected)

          expect(result.pass).toEqual(false)
          expect(result.message()).toEqual(
            `expected messages to match\n\nexpected message: "expected"\nreceived message: "received"`,
          )
          expect(equals.mock.calls).toHaveLength(0)
        })
        test('Then it passes as a Jest matcher when called with .not', () => {
          const expected: Expected = {
            message: 'expected',
          }
          const received = resultError('received')
          assertResultError(received)

          expect(received).not.toEqualResultError(expected)
        })
      })
    })
    describe('When the received error result is initialized with an error matching the default', () => {
      describe('and the messages match', () => {
        test('Then it passes', () => {
          const expected: Expected = {
            message: 'message',
            error: new Error('Result error'),
          }
          const received = resultError('message')
          assertResultError(received)
          const equals = jest.fn().mockReturnValueOnce(true)

          const result = toEqualResultError.call({ equals }, received, expected)

          expect(result.pass).toEqual(true)
          expect(result.message()).toEqual(`expected error result not to equal error result`)
          expect(equals.mock.calls).toHaveLength(1)
          expect(equals.mock.calls[0]).toEqual([received.error, new Error('Result error')])
        })
        test('Then it passes as a Jest matcher', () => {
          const expected: Expected = {
            message: 'message',
            error: new Error('Result error'),
          }
          const received = resultError('message')
          assertResultError(received)

          expect(received).toEqualResultError(expected)
        })
      })
    })
    describe("When the received error result is initialized with an error that doesn't match the default", () => {
      test('Then it fails', () => {
        const expected: Expected = {
          message: 'message',
          error: new Error('Result error'),
        }
        const received = resultError('message', new Error('different error'))
        assertResultError(received)
        const equals = jest.fn().mockReturnValueOnce(false)

        const result = toEqualResultError.call({ equals }, received, expected)

        expect(result.pass).toEqual(false)
        expect(result.message()).toEqual(`expected errors to match`)
        expect(equals.mock.calls).toHaveLength(1)
        expect(equals.mock.calls[0]).toEqual([received.error, new Error('Result error')])
      })
      test('Then it passes as a Jest matcher when called with .not', () => {
        const expected: Expected = {
          message: 'message',
          error: new Error('Result error'),
        }
        const received = resultError('message', new Error('different error'))
        assertResultError(received)

        expect(received).not.toEqualResultError(expected)
      })
    })
  })
  describe('Given an expected error result with an error', () => {
    describe('When the received error result is initialized without an error', () => {
      test('Then it fails', () => {
        const expected: Expected = {
          message: 'message',
          error: new Error('expected error'),
        }
        const received = resultError('message')
        assertResultError(received)
        const equals = jest.fn().mockReturnValueOnce(false)

        const result = toEqualResultError.call({ equals }, received, expected)

        expect(result.pass).toEqual(false)
        expect(result.message()).toEqual(`expected errors to match`)
        expect(equals.mock.calls).toHaveLength(1)
        expect(equals.mock.calls[0]).toEqual([received.error, new Error('expected error')])
      })
      test('Then it passes as a Jest matcher when called with .not', () => {
        const expected: Expected = {
          message: 'message',
          error: new Error('expected error'),
        }
        const received = resultError('message')
        assertResultError(received)

        expect(received).not.toEqualResultError(expected)
      })
    })
    describe('When the received error result is initialized with a matching error', () => {
      test('Then it passes', () => {
        const expected: Expected = {
          message: 'message',
          error: new Error('an error'),
        }
        const received = resultError('message', new Error('an error'))
        assertResultError(received)
        const equals = jest.fn().mockReturnValueOnce(true)

        const result = toEqualResultError.call({ equals }, received, expected)

        expect(result.pass).toEqual(true)
        expect(result.message()).toEqual(`expected error result not to equal error result`)
        expect(equals.mock.calls).toHaveLength(1)
        expect(equals.mock.calls[0]).toEqual([received.error, new Error('an error')])
      })
      test('Then it passes as a Jest matcher', () => {
        const expected: Expected = {
          message: 'message',
          error: new Error('an error'),
        }
        const received = resultError('message', new Error('an error'))
        assertResultError(received)

        expect(received).toEqualResultError(expected)
      })
    })
    describe('When the received error result is initialized with a non-matching error', () => {
      test('Then it fails', () => {
        const expected: Expected = {
          message: 'message',
          error: new Error('expected error'),
        }
        const received = resultError('message', new Error('received error'))
        assertResultError(received)
        const equals = jest.fn().mockReturnValueOnce(false)

        const result = toEqualResultError.call({ equals }, received, expected)

        expect(result.pass).toEqual(false)
        expect(result.message()).toEqual(`expected errors to match`)
        expect(equals.mock.calls).toHaveLength(1)
        expect(equals.mock.calls[0]).toEqual([received.error, new Error('expected error')])
      })
      test('Then it passes as a Jest matcher when called with .not', () => {
        const expected: Expected = {
          message: 'message',
          error: new Error('expected error'),
        }
        const received = resultError('message', new Error('received error'))
        assertResultError(received)

        expect(received).not.toEqualResultError(expected)
      })
    })
  })
})
