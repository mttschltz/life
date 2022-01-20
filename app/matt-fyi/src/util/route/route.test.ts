import { Routes, useRoute } from './route'

describe('useRoute', () => {
  describe('category detail route', () => {
    describe('Given a category', () => {
      test('Then it returns the expected path', () => {
        const route = useRoute()
        const category: Parameters<Routes['category']['detail']>[0] = {
          __typename: 'Store_Category',
          path: 'category-path',
        }
        expect(route.category.detail(category)).toEqual('/category-path')
      })
    })
  })
  describe('risk detail route', () => {
    describe('Given a risk', () => {
      test('Then it returns the expected path', () => {
        const route = useRoute()
        const risk: Parameters<Routes['risk']['detail']>[0] = {
          __typename: 'Store_Risk',
          id: 'risk-id',
        }
        expect(route.risk.detail(risk)).toEqual('/risk/risk-id')
      })
    })
  })
})
