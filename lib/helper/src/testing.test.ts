import { assertResultError, assertResultOk, assertZodParseError, mockThrows } from '@helper/testing'
import { ResultError, ResultOk } from './result'
import { z } from 'zod'

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
        metadata: {},
      }
    })
    test('Then calling assertResultError does not error', () => {
      expect(() => assertResultError(errorResult)).not.toThrow()
    })
    test('Then calling assertResultOk errors', () => {
      expect(() => assertResultOk(errorResult)).toThrow('Not a ResultOk')
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
      expect(() => assertResultError(okResult)).toThrow('Not a ResultError')
    })
  })
})
describe('jestFnThrows', () => {
  describe('Given an error message', () => {
    test('Then it returns a mocked implementation that throws the messsage', () => {
      const mock = mockThrows('error msg')
      expect(mock).toThrow('error msg')
      expect(mock).toThrow('error msg')
    })
  })
})
describe('assertZodParseError', () => {
  describe('Given a parse error', () => {
    describe('When called', () => {
      test('Then it returns true', () => {
        const result = z.string().safeParse(1)
        expect(() => assertZodParseError(result)).not.toThrow()
      })
    })
  })
  describe('Given a parse success', () => {
    describe('When called', () => {
      test('Then it returns false', () => {
        const result = z.string().safeParse('kaboom')
        expect(() => assertZodParseError(result)).toThrow('Not a Zod parse error')
      })
    })
  })
})
