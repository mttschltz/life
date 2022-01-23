import {
  isResultError,
  isResultOk,
  Result,
  ResultError,
  resultError,
  ResultOk,
  resultOk,
  Results,
  results,
  resultsError,
  resultsErrorResult,
  resultsOk,
} from '@helper/result'
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
        expect(result.ok).toBe(true)
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
          expect(result.ok).toBe(false)
          assertResultError(result)
          expect(result.message).toBe('an error message')
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
          expect(result.ok).toBe(false)
          assertResultError(result)
          expect(result.error).toBe(error)
        })
      })
    })
  })
  describe('resultsError', () => {
    describe('Given an error message', () => {
      describe('When no error object is provided', () => {
        test('Then Results is returned with the expected single error', () => {
          const r = resultsError('error message')
          expect(r.firstErrorResult).toMatchObject({
            message: 'error message',
            error: new Error('Result error'),
            ok: false,
          })
          expect(r.okValues).toEqual([])
          expect(r.values).toEqual([undefined])
        })
      })
      describe('When an error object is provided', () => {
        test('Then Results is returned with the expected single error', () => {
          const error = new Error('error object')
          const r = resultsError('error message', error)
          expect(r.firstErrorResult).toMatchObject({
            message: 'error message',
            error: new Error('error object'),
            ok: false,
          })
          expect(r.firstErrorResult?.error).toBe(error)
          expect(r.okValues).toEqual([])
          expect(r.values).toEqual([undefined])
        })
      })
    })
  })
  describe('resultsErrorResult', () => {
    describe('Given an error result', () => {
      describe('When no error object is provided', () => {
        test('Then Results is returned with the expected single error', () => {
          const err = {
            error: new Error('error object'),
            message: 'error message',
            ok: false as const,
          }
          const r = resultsErrorResult(err)
          expect(r.firstErrorResult).toBe(err)
          expect(r.okValues).toEqual([])
          expect(r.values).toEqual([undefined])
        })
      })
    })
  })
  describe('resultsOk', () => {
    describe('Given a list of values', () => {
      test('Then a Results instance is returned with no first error value', () => {
        const r = resultsOk(['one', 'two', 'three'])
        expect(r.firstErrorResult).toBeUndefined()
        expect(r.okValues).toEqual(['one', 'two', 'three'])
        expect(r.values).toEqual(['one', 'two', 'three'])
      })
    })
  })
  describe('results', () => {
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
        test('Then withOnlyFirstError returns a new Results instance with only the first error', () => {
          const rs2 = rs.withOnlyFirstError()
          expect(rs2.firstErrorResult).toEqual(result2)
          expect(rs2.okValues).toEqual([])
          expect(rs2.values).toEqual([undefined])
        })
      })
    })
    describe('Given a list of results with no errors', () => {
      let inputResults: Result<OkType>[]
      let result1: ResultOk<OkType>
      let result3: ResultOk<OkType>
      beforeEach(() => {
        result1 = {
          ok: true,
          value: {
            cat: 'dog',
          },
        }
        result3 = {
          ok: true,
          value: {
            cat: 'donkey',
          },
        }
        inputResults = [result1, result3]
      })
      describe('When results is called', () => {
        let rs: Results<OkType>
        beforeEach(() => {
          rs = results(inputResults)
        })
        test('Then firstErrorResult returns undefined', () => {
          expect(rs.firstErrorResult).toBeUndefined()
        })
        test('Then values returns both entries', () => {
          expect(rs.values).toEqual([result1.value, result3.value])
        })
        test('Then okValues returns both ok values', () => {
          expect(rs.okValues).toEqual([result1.value, result3.value])
        })
        test('Then withOnlyFirstError returns a new Results instance with no entries', () => {
          const rs2 = rs.withOnlyFirstError()
          expect(rs2.firstErrorResult).toBeUndefined()
          expect(rs2.okValues).toEqual([])
          expect(rs2.values).toEqual([])
        })
      })
    })
  })
})
describe('isResultOk', () => {
  describe('Given an ok result', () => {
    test('Then it returns true', () => {
      const ok = resultOk('result')
      expect(isResultOk(ok)).toBe(true)
    })
  })
  describe('Given an error result', () => {
    test('Then it returns false', () => {
      const err = resultError<string>('error')
      expect(isResultOk(err)).toBe(false)
    })
  })
})
describe('isResultError', () => {
  describe('Given an error result', () => {
    test('Then it returns true', () => {
      const err = resultError<string>('error')
      expect(isResultError(err)).toBe(true)
    })
  })
  describe('Given an ok result', () => {
    test('Then it returns false', () => {
      const ok = resultOk('result')
      expect(isResultError(ok)).toBe(false)
    })
  })
})
