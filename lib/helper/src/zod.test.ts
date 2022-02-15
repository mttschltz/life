import { z } from 'zod'
import { assertZodParseError } from './testing'
import { resultZodError } from './zod'

describe('zod', () => {
  describe('resultZodError', () => {
    describe('Given a non-object schema with one criteria', () => {
      let schema: z.ZodString
      beforeEach(() => {
        schema = z.string()
      })
      describe('When called with a message and error', () => {
        describe('and no metadata', () => {
          test('Then it returns the result error', () => {
            const parseResult = schema.safeParse(1)
            assertZodParseError(parseResult)
            const errorResult = resultZodError('the object', parseResult.error)
            expect(errorResult).toEqualResultError({
              message: "Invalid value for the object: 'Expected string, received number' (invalid_type).",
              error: new Error("Invalid value for the object: 'Expected string, received number' (invalid_type)."),
              metadata: {
                errors: [
                  {
                    code: 'invalid_type',
                    message: 'Expected string, received number',
                    path: [],
                  },
                ],
                errorType: 'ZodError',
              },
            })
          })
        })
        describe('and metadata', () => {
          test('Then it returns the result error with merged metadata', () => {
            const parseResult = schema.safeParse(1)
            assertZodParseError(parseResult)
            const errorResult = resultZodError('the object', parseResult.error, {
              string: 'a string',
              number: 1,
              nested: {
                nestedString: 'a nested string',
              },
            })
            expect(errorResult).toEqualResultError({
              message: "Invalid value for the object: 'Expected string, received number' (invalid_type).",
              error: new Error("Invalid value for the object: 'Expected string, received number' (invalid_type)."),
              metadata: {
                string: 'a string',
                number: 1,
                nested: {
                  nestedString: 'a nested string',
                },
                errors: [
                  {
                    code: 'invalid_type',
                    message: 'Expected string, received number',
                    path: [],
                  },
                ],
                errorType: 'ZodError',
              },
            })
          })
        })
      })
    })
    describe('Given a non-object schema with two requirements', () => {
      let schema: z.ZodString
      beforeEach(() => {
        schema = z.string().min(10).email()
      })
      describe('When called with a message and error, generating multiple issues', () => {
        test('Then it returns the result with all issues', () => {
          const parseResult = schema.safeParse('blah')
          assertZodParseError(parseResult)
          const errorResult = resultZodError('the object', parseResult.error)
          expect(errorResult).toEqualResultError({
            message: "Invalid value for the object: 'Should be at least 10 characters' (too_small).",
            error: new Error("Invalid value for the object: 'Should be at least 10 characters' (too_small)."),
            metadata: {
              errors: [
                {
                  code: 'too_small',
                  message: 'Should be at least 10 characters',
                  path: [],
                },
                {
                  code: 'invalid_string',
                  message: 'Invalid email',
                  path: [],
                },
              ],
              errorType: 'ZodError',
            },
          })
        })
      })
    })
    describe('Given an object schema', () => {
      let schema: z.ZodObject<
        {
          number: z.ZodNumber
          string: z.ZodString
        },
        'strip',
        z.ZodTypeAny,
        {
          string: string
          number: number
        },
        {
          string: string
          number: number
        }
      >
      beforeEach(() => {
        schema = z.object({
          number: z.number(),
          string: z.string(),
        })
      })
      describe('When called with a message and error', () => {
        test('Then it returns the result', () => {
          const parseResult = schema.safeParse({
            number: 'not a number',
            string: 'a string',
          })
          assertZodParseError(parseResult)
          const errorResult = resultZodError('the object', parseResult.error)
          expect(errorResult).toEqualResultError({
            message: "Invalid prop number in the object: 'Expected number, received string' (invalid_type).",
            error: new Error("Invalid prop number in the object: 'Expected number, received string' (invalid_type)."),
            metadata: {
              errors: [
                {
                  code: 'invalid_type',
                  message: 'Expected number, received string',
                  path: ['number'],
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
