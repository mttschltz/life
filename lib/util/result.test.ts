import { Result, ResultError, resultError, ResultOk, resultOk, Results, results } from '@util/result'
import { assertResultError, assertResultOk } from './testing'

interface OkType {
  cat: string
}

describe('Result', () => {
  describe('Given an ok Result', () => {
    let result: Result<OkType>
    let value: OkType
    beforeEach(() => {
      value = { cat: 'dog' }
      result = resultOk(value)
    })
    describe('When resultOk is called', () => {
      test('Then it returns the expected values', () => {
        expect(result.ok).toEqual(true)
        assertResultOk(result)
        expect(result.value).toBe(value)
      })
    })
  })
  describe('Given an error Result', () => {
    describe('When resultError is called', () => {
      describe('And an Error is not provided', () => {
        let result: Result<string>
        beforeEach(() => {
          result = resultError('an error message')
        })
        test('Then it returns the expected values', () => {
          expect(result.ok).toEqual(false)
          assertResultError(result)
          expect(result.message).toEqual('an error message')
          expect(result.error).toEqual(new Error('Result error'))
        })
      })
      describe('And an Error is provided', () => {
        let result: Result<string>
        let error: Error
        beforeEach(() => {
          error = new Error('an error')
          result = resultError('an error message', error)
        })
        test('Then it returns the expected values', () => {
          expect(result.ok).toEqual(false)
          assertResultError(result)
          expect(result.error).toBe(error)
        })
      })
    })
  })
  describe('Given a list of results', () => {
    let inputResults: Result<OkType>[]
    let result1: ResultOk<OkType>
    let result2: ResultError
    let result3: ResultOk<OkType>
    let result4: ResultError
    beforeEach(() => {
      result1 = {
        ok: true,
        value: {
          cat: 'dog',
        },
      }
      result2 = {
        ok: false,
        message: 'an error message',
        error: new Error('an error'),
      }
      result3 = {
        ok: true,
        value: {
          cat: 'donkey',
        },
      }
      result4 = {
        ok: false,
        message: 'an error message 2',
        error: new Error('an error 2'),
      }
      inputResults = [result1, result2, result3, result4]
    })
    describe('When results is called', () => {
      let rs: Results<OkType>
      beforeEach(() => {
        rs = results(inputResults)
      })
      test('Then firstErrorResult returns the first error', () => {
        expect(rs.firstErrorResult).toBe(result2)
      })
      test('Then values returns 4 entries with undefined for ok Results', () => {
        expect(rs.values).toEqual([result1.value, undefined, result3.value, undefined])
      })
      test('Then okValues returns the 2 ok values', () => {
        expect(rs.okValues).toEqual([result1.value, result3.value])
      })
    })
  })
})
