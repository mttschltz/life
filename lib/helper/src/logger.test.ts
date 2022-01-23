import { Logger, newLogger } from '@helper/logger'
import { ResultError, ResultOk } from '@helper/result'

describe('Logger', () => {
  describe('Given a logger', () => {
    let log: Logger
    let info: jest.SpiedFunction<typeof console.info>
    let warn: jest.SpiedFunction<typeof console.warn>
    let error: jest.SpiedFunction<typeof console.error>
    beforeEach(() => {
      log = newLogger()
      info = jest.spyOn(console, 'info')
      warn = jest.spyOn(console, 'warn')
      error = jest.spyOn(console, 'error')
    })
    describe('When calling info with no data', () => {
      test('Then it logs to console.info', () => {
        log.info({
          msg: 'info message',
        })
        expect(info.mock.calls).toHaveLength(1)
        expect(info.mock.calls[0]).toEqual(['info message'])

        // And doesn't log to other console methods
        expect(warn.mock.calls).toHaveLength(0)
        expect(error.mock.calls).toHaveLength(0)
      })
    })
    describe('When calling info with data', () => {
      test('Then it logs to console.info', () => {
        const data = {
          cat: 'dog',
        }
        log.info({
          msg: 'info message',
          data,
        })
        expect(info.mock.calls).toHaveLength(1)
        expect(info.mock.calls[0]).toEqual(['info message', data])
      })
    })
    describe('When calling warn with no data', () => {
      test('Then it logs to console.warn', () => {
        log.warn({
          msg: 'warn message',
        })
        expect(warn.mock.calls).toHaveLength(1)
        expect(warn.mock.calls[0]).toEqual(['warn message'])

        // And doesn't log to other console methods
        expect(info.mock.calls).toHaveLength(0)
        expect(error.mock.calls).toHaveLength(0)
      })
    })
    describe('When calling warn with data', () => {
      test('Then it logs to console.warn', () => {
        const data = {
          cat: 'dog',
        }
        log.warn({
          msg: 'warn message',
          data,
        })
        expect(warn.mock.calls).toHaveLength(1)
        expect(warn.mock.calls[0]).toEqual(['warn message', data])
      })
    })
    describe('When calling error with no data', () => {
      test('Then it logs to console.error', () => {
        log.error({
          msg: 'error message',
        })
        expect(error.mock.calls).toHaveLength(1)
        expect(error.mock.calls[0]).toEqual(['error message'])

        // And doesn't log to other console methods
        expect(info.mock.calls).toHaveLength(0)
        expect(warn.mock.calls).toHaveLength(0)
      })
    })
    describe('When calling error with data', () => {
      test('Then it logs to console.error', () => {
        const data = {
          cat: 'dog',
        }
        log.error({
          msg: 'error message',
          data,
        })
        expect(error.mock.calls).toHaveLength(1)
        expect(error.mock.calls[0]).toEqual(['error message', data])
      })
    })
    describe('When calling result with an error result', () => {
      test('Then it logs to console.error', () => {
        const anError = new Error('an error')
        log.result({
          message: 'an error message',
          ok: false,
          error: anError,
        } as ResultError)
        expect(error.mock.calls).toHaveLength(1)
        expect(error.mock.calls[0]).toEqual(['an error message', anError])

        // And doesn't log to other console methods
        expect(info.mock.calls).toHaveLength(0)
        expect(warn.mock.calls).toHaveLength(0)
      })
    })
    describe('When calling result with an ok result', () => {
      test('Then it logs to console.info', () => {
        const value = {
          cat: 'dog',
        }
        log.result({
          ok: true,
          value,
        } as ResultOk<typeof value>)
        expect(info.mock.calls).toHaveLength(1)
        expect(info.mock.calls[0]).toEqual(['ok result', { value }])

        // And doesn't log to other console methods
        expect(warn.mock.calls).toHaveLength(0)
        expect(error.mock.calls).toHaveLength(0)
      })
    })
  })
})
