import { z } from 'zod'
import { assertZodParseError } from './testing'
import { resultZodError } from './zod'

describe('zod', () => {
  describe('resultZodError', () => {
    describe('Given a message and error', () => {
      describe('and no metadata', () => {
        describe('When called', () => {
          test('Then it returns the result error', () => {
            const schema = z.string()
            const parseResult = schema.safeParse(1)
            assertZodParseError(parseResult)
            const errorResult = resultZodError('a message', parseResult.error)
            expect(errorResult).toEqualResultError({
              message: 'a message',
              error: new Error('Expected string, received number'),
              metadata: {
                errors: [{ code: 'invalid_type', message: 'Expected string, received number' }],
                errorType: 'ZodError',
              },
            })
          })
        })
      })
      describe('and metadata', () => {
        describe('When called', () => {
          test('Then it returns the result error with merged metadata', () => {
            const schema = z.string()
            const parseResult = schema.safeParse(1)
            assertZodParseError(parseResult)
            const errorResult = resultZodError('a message', parseResult.error, {
              string: 'a string',
              number: 1,
              nested: {
                nestedString: 'a nested string',
              },
            })
            expect(errorResult).toEqualResultError({
              message: 'a message',
              error: new Error('Expected string, received number'),
              metadata: {
                string: 'a string',
                number: 1,
                nested: {
                  nestedString: 'a nested string',
                },
                errors: [{ code: 'invalid_type', message: 'Expected string, received number' }],
                errorType: 'ZodError',
              },
            })
          })
        })
      })
    })
    describe('Given a message and error with multiple issues', () => {
      describe('When called', () => {
        test('Then the result is returned with all issues', () => {
          const schema = z.string().min(10).email()
          const parseResult = schema.safeParse('blah')
          assertZodParseError(parseResult)
          const errorResult = resultZodError('a message', parseResult.error)
          expect(errorResult).toEqualResultError({
            message: 'a message',
            error: new Error('Should be at least 10 characters'),
            metadata: {
              errors: [
                {
                  code: 'too_small',
                  message: 'Should be at least 10 characters',
                },
                {
                  code: 'invalid_string',
                  message: 'Invalid email',
                },
              ],
              errorType: 'ZodError',
            },
          })
        })
      })
    })
  })
})
