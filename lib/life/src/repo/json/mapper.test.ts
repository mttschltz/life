import { Category, newCategory } from '@life/category'
import { CategoryJson, newCategoryMapper } from '@life/repo/json/mapper'
import { resultError, resultOk } from '@helper/result'
import { assertResultError, assertResultOk } from '@helper/testing'

jest.mock('@life/category')

describe('CategoryMapper', () => {
  describe('Given a domain category', () => {
    describe('When it has only optional properties', () => {
      test('Then it maps to JSON correctly', () => {
        const mapper = newCategoryMapper()
        const updated = new Date()
        const category: Category = {
          id: 'id',
          name: 'name',
          path: 'path',
          shortDescription: 'short description',
          children: [],
          updated,
        }
        expect(mapper.toJson(category)).toEqual({
          id: 'id',
          name: 'name',
          path: 'path',
          shortDescription: 'short description',
          children: [],
          updated,
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
          shortDescription: 'parent short description',
          children: [],
          updated: new Date(),
        }
        const child1: Category = {
          id: 'child1 id',
          name: 'child1 name',
          path: 'child1 path',
          shortDescription: 'child1 short description',
          children: [],
          updated: new Date(),
        }
        const child2: Category = {
          id: 'child2 id',
          name: 'child2 name',
          path: 'child2 path',
          shortDescription: 'child2 short description',
          children: [],
          updated: new Date(),
        }
        const updated = new Date()
        const category: Category = {
          id: 'id',
          name: 'name',
          path: 'path',
          description: 'description',
          shortDescription: 'short description',
          children: [child1, child2],
          parent,
          updated,
        }
        expect(mapper.toJson(category)).toEqual({
          id: 'id',
          name: 'name',
          path: 'path',
          children: ['child1 id', 'child2 id'],
          description: 'description',
          shortDescription: 'short description',
          parentId: 'parent id',
          updated,
        } as CategoryJson)
      })
    })
  })
  describe('Given a JSON category', () => {
    describe('When it has only optional properties', () => {
      test('Then it creates and returns the expected domain object', () => {
        const newCategoryMock = newCategory as jest.MockedFunction<typeof newCategory>
        const newCategoryResult = resultOk<Category>({
          id: 'id',
          name: 'name',
          path: 'path',
          shortDescription: 'short description',
          children: [],
          updated: new Date(),
        })
        newCategoryMock.mockReturnValueOnce(newCategoryResult)

        const categoryUpdated = new Date()
        const mapper = newCategoryMapper()
        const category: CategoryJson = {
          id: 'id',
          name: 'name',
          path: 'path',
          shortDescription: 'short description',
          children: [],
          updated: categoryUpdated,
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
            shortDescription: 'short description',
            children: [],
            updated: categoryUpdated,
          },
        ] as Parameters<typeof newCategory>)
      })
    })
    describe('When it has all properties', () => {
      test('Then it creates and returns the expected domain object', () => {
        const newCategoryMock = newCategory as jest.MockedFunction<typeof newCategory>
        const newCategoryResult = resultOk<Category>({
          id: 'id',
          name: 'name',
          path: 'path',
          shortDescription: 'short description',
          children: [],
          updated: new Date(),
        })
        newCategoryMock.mockReturnValueOnce(newCategoryResult)

        const mapper = newCategoryMapper()
        const categoryUpdated = new Date()
        const category: CategoryJson = {
          id: 'id',
          name: 'name',
          path: 'path',
          shortDescription: 'short description',
          children: [],
          updated: categoryUpdated,
        }
        const parent: Category = {
          id: 'parent id',
          name: 'parent name',
          path: 'parent path',
          shortDescription: 'parent short description',
          children: [],
          updated: new Date(),
        }
        const children: Category[] = [
          {
            id: 'child1 id',
            name: 'child1 name',
            path: 'child1 path',
            shortDescription: 'child1 short description',
            children: [],
            updated: new Date(),
          },
          {
            id: 'child2 id',
            name: 'child2 name',
            path: 'child2 path',
            shortDescription: 'child2 short description',
            children: [],
            updated: new Date(),
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
            shortDescription: 'short description',
            parent,
            children,
            updated: categoryUpdated,
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
          shortDescription: 'short description',
          children: [],
          updated: new Date(),
        }

        const result = mapper.fromJson(category, undefined, [])
        assertResultError(result)
        expect(result).toBe(newCategoryResult)
      })
    })
  })
})
