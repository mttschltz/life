import { Category, newCategory } from '@life/category'
import { CategoryJson, newCategoryMapper } from '@life/repo/json/mapper'
import { resultError, resultOk } from '@util/result'
import { assertResultError, assertResultOk } from '@util/testing'

jest.mock('@life/category')

describe('CategoryMapper', () => {
  describe('Given a domain category', () => {
    describe('When it has only optional properties', () => {
      test('Then it maps to JSON correctly', () => {
        const mapper = newCategoryMapper()
        const category: Category = {
          id: 'id',
          name: 'name',
          path: 'path',
          children: [],
        }
        expect(mapper.toJson(category)).toEqual({
          id: 'id',
          name: 'name',
          path: 'path',
          children: [],
        } as CategoryJson)
      })
    })
    describe('When it has all properties', () => {
      test('Then it maps to JSON correctly', () => {
        const mapper = newCategoryMapper()
        const parent: Category = {
          id: 'parent id',
          name: 'parent name',
          path: 'parent path',
          children: [],
        }
        const child1: Category = {
          id: 'child1 id',
          name: 'child1 name',
          path: 'child1 path',
          children: [],
        }
        const child2: Category = {
          id: 'child2 id',
          name: 'child2 name',
          path: 'child2 path',
          children: [],
        }
        const category: Category = {
          id: 'id',
          name: 'name',
          path: 'path',
          description: 'description',
          children: [child1, child2],
          parent,
        }
        expect(mapper.toJson(category)).toEqual({
          id: 'id',
          name: 'name',
          path: 'path',
          children: ['child1 id', 'child2 id'],
          description: 'description',
          parentId: 'parent id',
        } as CategoryJson)
      })
    })
  })
  describe('Given a JSON category', () => {
    describe('When it has only optional properties', () => {
      test('Then it creates and returns the expected domain object', () => {
        const newCategoryMock = newCategory as jest.MockedFunction<typeof newCategory>
        const newCategoryResult = resultOk({
          id: 'id',
          name: 'name',
          path: 'path',
          children: [],
        })
        newCategoryMock.mockReturnValueOnce(newCategoryResult)

        const mapper = newCategoryMapper()
        const category: CategoryJson = {
          id: 'id',
          name: 'name',
          path: 'path',
          children: [],
        }

        const result = mapper.fromJson(category, undefined, [])
        assertResultOk(result)
        expect(result).toBe(newCategoryResult)
        expect(newCategoryMock.mock.calls).toHaveLength(1)
        expect(newCategoryMock.mock.calls[0]).toEqual([
          'id',
          {
            name: 'name',
            path: 'path',
            children: [],
          },
        ] as Parameters<typeof newCategory>)
      })
    })
    describe('When it has all properties', () => {
      test('Then it creates and returns the expected domain object', () => {
        const newCategoryMock = newCategory as jest.MockedFunction<typeof newCategory>
        const newCategoryResult = resultOk({
          id: 'id',
          name: 'name',
          path: 'path',
          children: [],
        })
        newCategoryMock.mockReturnValueOnce(newCategoryResult)

        const mapper = newCategoryMapper()
        const category: CategoryJson = {
          id: 'id',
          name: 'name',
          path: 'path',
          children: [],
        }
        const parent: Category = {
          id: 'parent id',
          name: 'parent name',
          path: 'parent path',
          children: [],
        }
        const children: Category[] = [
          {
            id: 'child1 id',
            name: 'child1 name',
            path: 'child1 path',
            children: [],
          },
          {
            id: 'child2 id',
            name: 'child2 name',
            path: 'child2 path',
            children: [],
          },
        ]

        const result = mapper.fromJson(category, parent, children)
        assertResultOk(result)
        expect(result).toBe(newCategoryResult)
        expect(newCategoryMock.mock.calls).toHaveLength(1)
        expect(newCategoryMock.mock.calls[0]).toEqual([
          'id',
          {
            name: 'name',
            path: 'path',
            parent,
            children,
          },
        ] as Parameters<typeof newCategory>)
      })
    })
    describe('When newCategory returns an error result', () => {
      test('Then it returns the same error result', () => {
        const newCategoryMock = newCategory as jest.MockedFunction<typeof newCategory>
        const newCategoryResult = resultError<Category>('error')
        newCategoryMock.mockReturnValueOnce(newCategoryResult)

        const mapper = newCategoryMapper()
        const category: CategoryJson = {
          id: 'id',
          name: 'name',
          path: 'path',
          children: [],
        }

        const result = mapper.fromJson(category, undefined, [])
        assertResultError(result)
        expect(result).toBe(newCategoryResult)
      })
    })
  })
})
