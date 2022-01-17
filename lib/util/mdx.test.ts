import { transpile } from './mdx'

describe('mdx', () => {
  describe('transpile', () => {
    describe('Given no mdx string', () => {
      test('Then it returns undefined', () => {
        expect(transpile()).toBeUndefined()
      })
    })
    describe('Given an mdx string', () => {
      test('Then the result matches the snapshot', () => {
        expect(
          transpile(`# Heading
  
  Some paragraph text
        `),
        ).toMatchSnapshot()
      })
    })
  })
})
