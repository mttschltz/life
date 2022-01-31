import { filterNonNullish } from './graph'

describe('graph', () => {
  describe('filterNonNullish', () => {
    describe('Given a nullish object', () => {
      test('Then it returns false', () => {
        expect(filterNonNullish(undefined)).toBe(false)
        expect(filterNonNullish(null)).toBe(false)
      })
    })
    describe('Given a non-nullish object', () => {
      test('Then it returns true', () => {
        expect(filterNonNullish({})).toBe(true)
        expect(filterNonNullish({ id: 'id' })).toBe(true)
        expect(filterNonNullish(5)).toBe(true)
        expect(filterNonNullish(0)).toBe(true)
        expect(filterNonNullish('')).toBe(true)
        expect(filterNonNullish(false)).toBe(true)
        expect(filterNonNullish(true)).toBe(true)
      })
    })
  })
})
