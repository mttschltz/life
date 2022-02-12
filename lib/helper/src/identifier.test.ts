import { newIdentifier } from './identifier'
import { assertResultError, assertResultOk } from './testing'

describe('identifier', () => {
  describe('newIdentifier', () => {
    describe('Given an id one or more characters in length', () => {
      describe('When called', () => {
        test('Then an ok result is returned', () => {
          let result = newIdentifier('i')
          assertResultOk(result)
          expect(result.value).toEqual({ val: 'i' })

          result = newIdentifier('an id')
          assertResultOk(result)
          expect(result.value).toEqual({ val: 'an id' })
        })
      })
    })
    describe('Given an id of no length', () => {
      describe('When called', () => {
        test('Then an error result is returned', () => {
          const result = newIdentifier('')
          assertResultError(result)
          expect(result).toEqualResultError({
            message: 'Invalid identifier',
            error: new Error('Should be at least 1 characters'),
            metadata: {
              id: '',
              errorType: 'ZodError',
              errors: [
                {
                  code: 'too_small',
                  message: 'Should be at least 1 characters',
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
            message: 'Invalid identifier',
            error: new Error('Expected string, received number'),
            metadata: {
              id: 5,
              errorType: 'ZodError',
              errors: [
                {
                  code: 'invalid_type',
                  message: 'Expected string, received number',
                },
              ],
            },
          })
        })
      })
    })
  })
})
