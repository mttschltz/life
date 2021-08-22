import { assertResultError, assertResultOk } from '@util/testing'
import { ResultError, ResultOk } from './result'

interface OkType {
  cat: string
}

describe('testing', () => {
  describe('Given an error Result', () => {
    let errorResult: ResultError
    beforeEach(() => {
      errorResult = {
        ok: false,
        error: new Error('an error'),
        message: 'an error message',
      }
    })
    test('Then calling assertResultError does not error', () => {
      expect(() => assertResultError(errorResult)).not.toThrow()
    })
    test('Then calling assertResultOk errors', () => {
      expect(() => assertResultOk(errorResult)).toThrowError('Not a ResultOk')
    })
  })
  describe('Given an ok Result', () => {
    let okResult: ResultOk<OkType>
    beforeEach(() => {
      okResult = {
        ok: true,
        value: {
          cat: 'dog',
        },
      }
    })
    test('Then calling assertResultOk does not error', () => {
      expect(() => assertResultOk(okResult)).not.toThrow()
    })
    test('Then calling assertResultError errors', () => {
      expect(() => assertResultError(okResult)).toThrowError('Not a ResultError')
    })
  })
})
