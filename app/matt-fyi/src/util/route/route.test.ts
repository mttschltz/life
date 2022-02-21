import { Routes, useRoute } from './route'

describe('useRoute', () => {
  describe('category detail route', () => {
    describe('Given a category', () => {
      test('Then it returns the expected URL', () => {
        const route = useRoute()
        const category: Parameters<Routes['category']['detail']>[0] = {
          __typename: 'Store_Category',
          slug: 'category-slug',
        }
        expect(route.category.detail(category)).toBe('/category-slug')
      })
    })
  })
  describe('risk detail route', () => {
    describe('Given a risk', () => {
      test('Then it returns the expected URL', () => {
        const route = useRoute()
        const risk: Parameters<Routes['risk']['detail']>[0] = {
          __typename: 'Store_Risk',
          id: 'risk-id',
        }
        expect(route.risk.detail(risk)).toBe('/risk/risk-id')
      })
    })
  })
})
