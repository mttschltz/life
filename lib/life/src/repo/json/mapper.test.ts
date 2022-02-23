import { Category, newCategory } from '@life/category'
import { CategoryJson, newCategoryMapper } from '@life/repo/json/mapper'
import { Result, resultError, resultOk } from '@helper/result'
import { assertResultError, assertResultOk } from '@helper/testing'
import { Identifier, newIdentifier } from '@helper/identifier'

jest.mock('@life/category')
jest.mock('@helper/identifier')

describe('CategoryMapper', () => {
  describe('Given a domain category', () => {
    describe('When it has only optional properties', () => {
      test('Then it maps to JSON correctly', () => {
        const mapper = newCategoryMapper()
        const updated = new Date()
        const category: Category = {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'id' },
          name: 'name',
          slug: 'slug',
          previousSlugs: [],
          path: '/path',
          previousPaths: [],
          shortDescription: 'short description',
          children: [],
          updated,
        }
        expect(mapper.toJson(category)).toEqual({
          id: 'id',
          name: 'name',
          slug: 'slug',
          previousSlugs: [],
          path: '/path',
          previousPaths: [],
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
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'parent id' },
          name: 'parent name',
          slug: 'parent slug',
          previousSlugs: ['parent prev', 'parent ious'],
          path: '/parent path',
          previousPaths: ['/parent prev 1', '/parent prev 2'],
          shortDescription: 'parent short description',
          children: [],
          updated: new Date(),
        }
        const child1: Category = {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'child1 id' },
          name: 'child1 name',
          slug: 'child1 slug',
          previousSlugs: ['child1 prev', 'child1 ious'],
          path: '/child1 path',
          previousPaths: ['/child1 prev 1', '/child1 prev 2'],
          shortDescription: 'child1 short description',
          children: [],
          updated: new Date(),
        }
        const child2: Category = {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'child2 id' },
          name: 'child2 name',
          slug: 'child2 slug',
          previousSlugs: ['child2 prev', 'child2 ious'],
          path: '/child2 path',
          previousPaths: ['/child2 prev 1', '/child2 prev 2'],
          shortDescription: 'child2 short description',
          children: [],
          updated: new Date(),
        }
        const updated = new Date()
        const category: Category = {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'id' },
          name: 'name',
          slug: 'slug',
          previousSlugs: ['prev', 'ious'],
          path: '/path',
          previousPaths: ['/prev 1', '/prev 2'],
          description: 'description',
          shortDescription: 'short description',
          children: [child1, child2],
          parent,
          updated,
        }
        expect(mapper.toJson(category)).toEqual({
          id: 'id',
          name: 'name',
          slug: 'slug',
          previousSlugs: ['prev', 'ious'],
          path: '/path',
          previousPaths: ['/prev 1', '/prev 2'],
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
    let newIdentifierMock: jest.MockedFunction<typeof newIdentifier>
    let newCategoryMock: jest.MockedFunction<typeof newCategory>
    beforeEach(() => {
      newIdentifierMock = newIdentifier as jest.MockedFunction<typeof newIdentifier>
      newCategoryMock = newCategory as jest.MockedFunction<typeof newCategory>
    })

    describe('When it has only optional properties', () => {
      let newIdentifierResult: Result<Identifier>
      let newCategoryResult: Result<Category>
      beforeEach(() => {
        newIdentifierResult = resultOk<Identifier>({ __entity: 'Identifier', val: 'id' })
        newIdentifierMock.mockReset()
        newIdentifierMock.mockReturnValueOnce(newIdentifierResult)

        newCategoryResult = resultOk<Category>({
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'id' },
          name: 'name',
          slug: 'slug',
          previousSlugs: [],
          path: '/path',
          previousPaths: [],
          shortDescription: 'short description',
          children: [],
          updated: new Date(),
        })
        newCategoryMock.mockReset()
        newCategoryMock.mockReturnValueOnce(newCategoryResult)
      })
      test('Then it creates and returns the expected domain object', () => {
        const categoryUpdated = new Date()
        const mapper = newCategoryMapper()
        const category: CategoryJson = {
          id: 'id',
          name: 'name',
          slug: 'slug',
          previousSlugs: [],
          path: '/path',
          previousPaths: [],
          shortDescription: 'short description',
          children: [],
          updated: categoryUpdated,
        }

        const result = mapper.fromJson(category, undefined, [])
        assertResultOk(result)
        expect(result).toBe(newCategoryResult)
        expect(newCategoryMock.mock.calls).toHaveLength(1)
        expect(newCategoryMock.mock.calls[0]).toEqual([
          {
            id: { __entity: 'Identifier', val: 'id' },
            name: 'name',
            slug: 'slug',
            previousSlugs: [],
            path: '/path',
            previousPaths: [],
            shortDescription: 'short description',
            children: [],
            updated: categoryUpdated,
          },
        ] as Parameters<typeof newCategory>)
      })
    })
    describe('When it has all properties', () => {
      let newIdentifierResult: Result<Identifier>
      let newCategoryResult: Result<Category>
      beforeEach(() => {
        newIdentifierResult = resultOk<Identifier>({ __entity: 'Identifier', val: 'id' })
        newIdentifierMock.mockReset()
        newIdentifierMock.mockReturnValueOnce(newIdentifierResult)

        newCategoryResult = resultOk<Category>({
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'id' },
          name: 'name',
          slug: 'slug',
          previousSlugs: ['prev', 'ious'],
          path: '/path',
          previousPaths: ['/prev 1', '/prev 2'],
          shortDescription: 'short description',
          children: [],
          updated: new Date(),
        })
        newCategoryMock.mockReset()
        newCategoryMock.mockReturnValueOnce(newCategoryResult)
      })

      test('Then it creates and returns the expected domain object', () => {
        const mapper = newCategoryMapper()
        const categoryUpdated = new Date()
        const category: CategoryJson = {
          id: 'id',
          name: 'name',
          slug: 'slug',
          previousSlugs: ['prev', 'ious'],
          path: '/path',
          previousPaths: ['/prev 1', '/prev 2'],
          shortDescription: 'short description',
          children: [],
          updated: categoryUpdated,
        }
        const parent: Category = {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'parent id' },
          name: 'parent name',
          slug: 'parent slug',
          previousSlugs: [],
          path: '/parent path',
          previousPaths: [],
          shortDescription: 'parent short description',
          children: [],
          updated: new Date(),
        }
        const children: Category[] = [
          {
            __entity: 'Category',
            id: { __entity: 'Identifier', val: 'child1 id' },
            name: 'child1 name',
            slug: 'child1 slug',
            previousSlugs: [],
            path: '/child1 path',
            previousPaths: [],
            shortDescription: 'child1 short description',
            children: [],
            updated: new Date(),
          },
          {
            __entity: 'Category',
            id: { __entity: 'Identifier', val: 'child2 id' },
            name: 'child2 name',
            slug: 'child2 slug',
            previousSlugs: [],
            path: '/child2 path',
            previousPaths: [],
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
          {
            id: { __entity: 'Identifier', val: 'id' },
            name: 'name',
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            path: '/path',
            previousPaths: ['/prev 1', '/prev 2'],
            shortDescription: 'short description',
            parent,
            children,
            updated: categoryUpdated,
          },
        ] as Parameters<typeof newCategory>)
      })
    })
    describe('When newIdentity returns an error result', () => {
      let newIdentifierResult: Result<Identifier>
      let newCategoryResult: Result<Category>
      beforeEach(() => {
        newIdentifierResult = resultError<Identifier>('error')
        newIdentifierMock.mockReset()
        newIdentifierMock.mockReturnValueOnce(newIdentifierResult)

        newCategoryResult = resultOk<Category>({
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'id' },
          name: 'name',
          slug: 'slug',
          previousSlugs: [],
          path: '/path',
          previousPaths: [],
          shortDescription: 'short description',
          children: [],
          updated: new Date(),
        })
        newCategoryMock.mockReset()
        newCategoryMock.mockReturnValueOnce(newCategoryResult)
      })

      test('Then it returns the same error result', () => {
        const mapper = newCategoryMapper()
        const category: CategoryJson = {
          id: 'id',
          name: 'name',
          slug: 'slug',
          previousSlugs: [],
          path: '/path',
          previousPaths: [],
          shortDescription: 'short description',
          children: [],
          updated: new Date(),
        }

        const result = mapper.fromJson(category, undefined, [])
        assertResultError(result)
        expect(result).toBe(newIdentifierResult)
      })
    })
    describe('When newCategory returns an error result', () => {
      let newIdentifierResult: Result<Identifier>
      let newCategoryResult: Result<Category>
      beforeEach(() => {
        newIdentifierResult = resultOk<Identifier>({ __entity: 'Identifier', val: 'id' })
        newIdentifierMock.mockReset()
        newIdentifierMock.mockReturnValueOnce(newIdentifierResult)

        newCategoryResult = resultError<Category>('error')
        newCategoryMock.mockReset()
        newCategoryMock.mockReturnValueOnce(newCategoryResult)
      })
      test('Then it returns the same error result', () => {
        const mapper = newCategoryMapper()
        const category: CategoryJson = {
          id: 'id',
          name: 'name',
          slug: 'slug',
          previousSlugs: [],
          path: '/path',
          previousPaths: [],
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
