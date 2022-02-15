import { ResultError, resultError, resultOk } from '@helper/result'
import { assertResultError } from '@helper/testing'
import { toEqualResultError } from './setupJest'
import { diff } from 'jest-diff'

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

      expect(result.pass).toBe(false)
      expect(result.message()).toBe(`expected error to have property 'ok: true'`)
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
  describe('Given an expected error result with only a message', () => {
    describe('When the received error result is initialized without an error', () => {
      describe('and the messages match', () => {
        test('Then it passes', () => {
          const expected: Expected = {
            message: 'message',
          }
          const received = resultError('message')
          assertResultError(received)
          const equals = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)

          const result = toEqualResultError.call({ equals }, received, expected)

          expect(result.pass).toBe(true)
          expect(result.message()).toBe(`expected error result not to equal error result`)
          expect(equals.mock.calls).toHaveLength(2)
          expect(equals.mock.calls[0]).toEqual([received.error, new Error('Result error')])
          expect(equals.mock.calls[1]).toEqual([received.metadata, {}])
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

          expect(result.pass).toBe(false)
          expect(result.message()).toBe(
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
          const equals = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)

          const result = toEqualResultError.call({ equals }, received, expected)

          expect(result.pass).toBe(true)
          expect(result.message()).toBe(`expected error result not to equal error result`)
          expect(equals.mock.calls).toHaveLength(2)
          expect(equals.mock.calls[0]).toEqual([received.error, new Error('Result error')])
          expect(equals.mock.calls[1]).toEqual([received.metadata, {}])
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

        expect(result.pass).toBe(false)
        expect(result.message()).toBe(
          `expected errors to match\n\n${diff(new Error('Result error'), new Error('different error')) ?? ''}`,
        )
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

        expect(result.pass).toBe(false)
        expect(result.message()).toBe(
          `expected errors to match\n\n${diff(new Error('expected error'), new Error('Result error')) ?? ''}`,
        )
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
        const equals = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)

        const result = toEqualResultError.call({ equals }, received, expected)

        expect(result.pass).toBe(true)
        expect(result.message()).toBe(`expected error result not to equal error result`)
        expect(equals.mock.calls).toHaveLength(2)
        expect(equals.mock.calls[0]).toEqual([received.error, new Error('an error')])
        expect(equals.mock.calls[1]).toEqual([received.metadata, {}])
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

        expect(result.pass).toBe(false)
        expect(result.message()).toBe(
          `expected errors to match\n\n${diff(new Error('expected error'), new Error('received error')) ?? ''}`,
        )
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
  describe('Given an expected error result with metadata', () => {
    describe('When the received error result is initialized without metadata', () => {
      test('Then it fails', () => {
        const expected: Expected = {
          message: 'message',
          metadata: {
            string: 'a string',
            number: 1,
            nested: {
              string: 'a nested string',
            },
          },
        }
        const received = resultError('message')
        assertResultError(received)
        const equals = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false)

        const result = toEqualResultError.call({ equals }, received, expected)

        expect(result.pass).toBe(false)
        expect(result.message()).toBe(
          `expected metadata to match\n\n${
            diff(
              {
                string: 'a string',
                number: 1,
                nested: {
                  string: 'a nested string',
                },
              },
              {},
            ) ?? ''
          }`,
        )
        expect(equals.mock.calls).toHaveLength(2)
        expect(equals.mock.calls[0]).toEqual([received.error, new Error('Result error')])
        expect(equals.mock.calls[1]).toEqual([
          received.metadata,
          {
            string: 'a string',
            number: 1,
            nested: {
              string: 'a nested string',
            },
          },
        ])
      })
      test('Then it passes as a Jest matcher when called with .not', () => {
        const expected: Expected = {
          message: 'message',
          metadata: {
            string: 'a string',
            number: 1,
            nested: {
              string: 'a nested string',
            },
          },
        }
        const received = resultError('message')
        assertResultError(received)

        expect(received).not.toEqualResultError(expected)
      })
    })
    describe('When the received error result is initialized with matching metadata', () => {
      test('Then it passes', () => {
        const expected: Expected = {
          message: 'message',
          metadata: {
            string: 'a string',
            number: 1,
            nested: {
              string: 'a nested string',
            },
          },
        }
        const received = resultError('message', undefined, {
          string: 'a string',
          number: 1,
          nested: {
            string: 'a nested string',
          },
        })
        assertResultError(received)
        const equals = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)

        const result = toEqualResultError.call({ equals }, received, expected)

        expect(result.pass).toBe(true)
        expect(result.message()).toBe(`expected error result not to equal error result`)
        expect(equals.mock.calls).toHaveLength(2)
        expect(equals.mock.calls[0]).toEqual([received.error, new Error('Result error')])
        expect(equals.mock.calls[1]).toEqual([
          received.metadata,
          {
            string: 'a string',
            number: 1,
            nested: {
              string: 'a nested string',
            },
          },
        ])
      })
      test('Then it passes as a Jest matcher', () => {
        const expected: Expected = {
          message: 'message',
          metadata: {
            string: 'a string',
            number: 1,
            nested: {
              string: 'a nested string',
            },
          },
        }
        const received = resultError('message', undefined, {
          string: 'a string',
          number: 1,
          nested: {
            string: 'a nested string',
          },
        })
        assertResultError(received)

        expect(received).toEqualResultError(expected)
      })
    })
    describe('When the received error result is initialized with non-matching metadata', () => {
      test('Then it fails', () => {
        const expected: Expected = {
          message: 'message',
          metadata: {
            string: 'a string',
            number: 1,
            nested: {
              string: 'a nested string',
            },
          },
        }
        const received = resultError('message', undefined, {
          string: 'a string',
          number: 1,
          nested: {
            string: 'a nested string',
            nonMatching: 'nonMatching',
          },
        })
        assertResultError(received)
        const equals = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false)

        const result = toEqualResultError.call({ equals }, received, expected)

        expect(result.pass).toBe(false)
        expect(result.message()).toBe(
          `expected metadata to match\n\n${
            diff(
              {
                string: 'a string',
                number: 1,
                nested: {
                  string: 'a nested string',
                },
              },
              {
                string: 'a string',
                number: 1,
                nested: {
                  string: 'a nested string',
                  nonMatching: 'nonMatching',
                },
              },
            ) ?? ''
          }`,
        )
        expect(equals.mock.calls).toHaveLength(2)
        expect(equals.mock.calls[0]).toEqual([received.error, new Error('Result error')])
        expect(equals.mock.calls[1]).toEqual([
          received.metadata,
          {
            string: 'a string',
            number: 1,
            nested: {
              string: 'a nested string',
            },
          },
        ])
      })
      test('Then it passes as a Jest matcher when called with .not', () => {
        const expected: Expected = {
          message: 'message',
          metadata: {
            string: 'a string',
            number: 1,
            nested: {
              string: 'a nested string',
            },
          },
        }
        const received = resultError('message', undefined, {
          string: 'a string',
          number: 1,
          nested: {
            string: 'a nested string',
            nonMatching: 'nonMatching',
          },
        })
        assertResultError(received)

        expect(received).not.toEqualResultError(expected)
      })
    })
  })
})
