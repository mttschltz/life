import { newCategory, Category } from '@life/category'
import type { CreateDetails } from '@life/category'
import { describe, expect, test } from '@jest/globals'
import { assertResultError, assertResultOk } from '@util/testing'

describe('Category', () => {
  describe('Create', () => {
    let createDetails: CreateDetails
    let updated: Date
    beforeEach(() => {
      updated = new Date()
      createDetails = {
        path: 'path',
        name: 'name',
        description: undefined,
        shortDescription: 'short description',
        parent: undefined,
        children: [],
        updated,
      }
    })

    describe('Given a valid CreateDetails without optional fields', () => {
      describe('When there are no optional fields', () => {
        test('Then it successfully creates a Category', () => {
          const categoryResult = newCategory('id', {
            ...createDetails,
          })
          assertResultOk(categoryResult)

          const category = categoryResult.value
          expect(category.id).toBe('id')
          expect(category.path).toBe('path')
          expect(category.name).toBe('name')
          expect(category.description).toBeUndefined()
          expect(category.shortDescription).toBe('short description')
          expect(category.parent).toBeUndefined()
          expect(category.children).toHaveLength(0)
          expect(category.updated).toEqual(updated)
        })
      })
    })
    describe('Given a valid CreateDetails with all fields', () => {
      test('Then it successfully creates a Category', () => {
        const parent: Category = {
          id: 'parent id',
          children: [],
          name: 'parent name',
          path: 'parent path',
          shortDescription: 'parent short description',
          updated: new Date(),
        }
        const children: Category[] = [
          {
            id: 'child id',
            children: [],
            name: 'child name',
            path: 'child path',
            shortDescription: 'child short description',
            updated: new Date(),
          },
        ]
        const categoryResult = newCategory('id', {
          ...createDetails,
          parent,
          children,
          description: 'description',
        })
        assertResultOk(categoryResult)

        const category = categoryResult.value
        expect(category.id).toBe('id')
        expect(category.path).toBe('path')
        expect(category.name).toBe('name')
        expect(category.description).toBe('description')
        expect(category.shortDescription).toBe('short description')
        expect(category.parent).toBe(parent)
        expect(category.children).toBe(children)
        expect(category.updated).toBe(updated)
      })
    })
    describe('Given an invalid CreateDetails', () => {
      test('Then an error result is returned', () => {
        // @ts-expect-error: In the domain we want to protect against runtime type errors
        expect(() => newCategory('id', undefined)).toThrow()

        // @ts-expect-error: In the domain we want to protect against runtime type errors
        const categoryResult = newCategory('id', {})
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('children must be an array of Categorys')
      })
    })
    describe('Given an invalid id', () => {
      test('Then an error result is returned', () => {
        // @ts-expect-error: In the domain we want to protect against runtime type errors
        let categoryResult = newCategory(undefined, createDetails)
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('id must be a string')

        categoryResult = newCategory('', createDetails)
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('id must be longer than or equal to 1 characters')

        // @ts-expect-error: In the domain we want to protect against runtime type errors
        categoryResult = newCategory(5, createDetails)
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('id must be a string')
      })
    })
    describe('Given an invalid path', () => {
      test('Then an error result is returned', () => {
        let categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          path: undefined,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('path must be a string')

        categoryResult = newCategory('id', {
          ...createDetails,
          path: '',
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('path must be longer than or equal to 1 characters')

        categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          path: 5,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('path must be a string')
      })
    })
    describe('Given an invalid name', () => {
      test('Then an error result is returned', () => {
        let categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          name: undefined,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('name must be a string')

        categoryResult = newCategory('id', {
          ...createDetails,
          name: 'x',
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('name must be longer than or equal to 2 characters')

        categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          name: 5,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('name must be a string')
      })
    })
    describe('Given an invalid description', () => {
      describe('and the description is too short', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory('id', {
            ...createDetails,
            description: 'x',
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe('description must be longer than or equal to 2 characters')
        })
      })
      describe('and the description is not a string', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory('id', {
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            description: 5,
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe('description must be a string')
        })
      })
    })
    describe('Given an invalid short description', () => {
      describe('and the short description is not provided', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory('id', {
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            shortDescription: undefined,
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe('shortDescription must be a string')
        })
      })
      describe('and the short description is too short', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory('id', {
            ...createDetails,
            shortDescription: 'x',
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe('shortDescription must be longer than or equal to 2 characters')
        })
      })
    })
    describe('Given an invalid children', () => {
      test('Then an error result is returned', () => {
        let categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          children: undefined,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('children must be an array of Categorys')

        categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          children: [{ other: 'object' }],
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('children must be an array of Categorys')
      })
    })
    describe('Given an invalid parent', () => {
      test('Then an error result is returned', () => {
        const categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          parent: { other: 'object' },
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe('parent must be a Category')
      })
    })
    describe('Given an invalid updated', () => {
      describe('and updated is not provided', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory('id', {
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            updated: undefined,
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe('updated must be a Date instance')
        })
      })
      describe('and updated is not a Date', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory('id', {
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            updated: '',
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe('updated must be a Date instance')
        })
      })
    })
  })
})
