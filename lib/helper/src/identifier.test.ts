import { newIdentifier } from './identifier'
import { assertResultError, assertResultOk } from './testing'

describe('identifier', () => {
  describe('newIdentifier', () => {
    describe('Given an id one or more characters in length', () => {
      describe('When called', () => {
        test('Then an ok result is returned', () => {
          let result = newIdentifier('i')
          assertResultOk(result)
          expect(result.value).toEqual({ __entity: 'Identifier', val: 'i' })

          result = newIdentifier('an id')
          assertResultOk(result)
          expect(result.value).toEqual({ __entity: 'Identifier', val: 'an id' })
        })
      })
    })
    describe('Given an id of no length', () => {
      describe('When called', () => {
        test('Then an error result is returned', () => {
          const result = newIdentifier('')
          assertResultError(result)
          expect(result).toEqualResultError({
            message: "Invalid value for identifier: 'Should be at least 1 characters' (too_small).",
            error: new Error("Invalid value for identifier: 'Should be at least 1 characters' (too_small)."),
            metadata: {
              id: '',
              errorType: 'ZodError',
              errors: [
                {
                  code: 'too_small',
                  message: 'Should be at least 1 characters',
                  path: [],
                },
              ],
            },
          })
        })
      })
    })
    describe('Given an id of the wrong type', () => {
      describe('When called', () => {
        test('Then an error result is returned', () => {
          const result = newIdentifier(5 as unknown as string)
          assertResultError(result)
          expect(result).toEqualResultError({
            message: "Invalid value for identifier: 'Expected string, received number' (invalid_type).",
            error: new Error("Invalid value for identifier: 'Expected string, received number' (invalid_type)."),
            metadata: {
              id: 5,
              errorType: 'ZodError',
              errors: [
                {
                  code: 'invalid_type',
                  message: 'Expected string, received number',
                  path: [],
                },
              ],
            },
          })
        })
      })
    })
  })
})
