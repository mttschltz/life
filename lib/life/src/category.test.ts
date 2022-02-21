import { newCategory, Category, isCategory } from '@life/category'
import type { CreateDetails } from '@life/category'
import { describe, expect, test } from '@jest/globals'
import { assertResultError, assertResultOk } from '@helper/testing'
import { Identifier } from '@helper/identifier'
import { create } from 'react-test-renderer'

describe('Category', () => {
  describe('Create', () => {
    let createDetails: CreateDetails
    let updated: Date
    let id: Identifier
    beforeEach(() => {
      updated = new Date()
      id = {
        __entity: 'Identifier',
        val: 'id',
      }
      createDetails = {
        id,
        slug: 'slug',
        previousSlugs: [],
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
          const categoryResult = newCategory({
            ...createDetails,
          })
          assertResultOk(categoryResult)

          const category = categoryResult.value
          expect(category).toEqual({
            __entity: 'Category',
            id,
            slug: 'slug',
            previousSlugs: [],
            name: 'name',
            description: undefined,
            shortDescription: 'short description',
            parent: undefined,
            children: [],
            updated,
          })
        })
      })
      describe('When the slugs are 1 character in length', () => {
        test('Then it successfully creates a Category', () => {
          const categoryResult = newCategory({
            ...createDetails,
            slug: 's',
            previousSlugs: ['a'],
          })
          assertResultOk(categoryResult)

          const category = categoryResult.value
          expect(category).toEqual({
            __entity: 'Category',
            id,
            slug: 's',
            previousSlugs: ['a'],
            name: 'name',
            description: undefined,
            shortDescription: 'short description',
            parent: undefined,
            children: [],
            updated,
          })
        })
      })
    })
    describe('Given a valid CreateDetails with all fields', () => {
      test('Then it successfully creates a Category', () => {
        const parent: Category = {
          __entity: 'Category',
          id: {
            __entity: 'Identifier',
            val: 'parent id',
          },
          children: [],
          name: 'parent name',
          slug: 'parent slug',
          previousSlugs: ['slug 1', 'slug 2'],
          shortDescription: 'parent short description',
          updated: new Date(),
        }
        const children: Category[] = [
          {
            __entity: 'Category',
            id: {
              __entity: 'Identifier',
              val: 'child id',
            },
            children: [],
            name: 'child name',
            slug: 'child slug',
            previousSlugs: ['slug 1', 'slug 2'],
            shortDescription: 'child short description',
            updated: new Date(),
          },
        ]
        const categoryResult = newCategory({
          ...createDetails,
          parent,
          children,
          description: 'description',
        })
        assertResultOk(categoryResult)

        const category = categoryResult.value
        expect(category).toEqual({
          __entity: 'Category',
          id,
          slug: 'slug',
          previousSlugs: [],
          name: 'name',
          description: 'description',
          shortDescription: 'short description',
          parent,
          children,
          updated,
        })
      })
    })
    describe('Given an invalid CreateDetails', () => {
      test('Then an error result is returned', () => {
        // @ts-expect-error: In the domain we want to protect against runtime type errors
        expect(() => newCategory({ other: 'prop' })).toThrow()

        // @ts-expect-error: In the domain we want to protect against runtime type errors
        const categoryResult = newCategory({ id })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe("Invalid prop slug in category: 'Required' (invalid_type).")
      })
    })
    describe('Given an invalid id', () => {
      test('Then an error result is returned', () => {
        // @ts-expect-error: In the domain we want to protect against runtime type errors
        let categoryResult = newCategory({ ...createDetails, id: 'string id' })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop id in category: 'Expected object, received string' (invalid_type).",
        )

        // @ts-expect-error: In the domain we want to protect against runtime type errors
        categoryResult = newCategory({ ...create, id: { val: 'invalid id object' } })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop id.__entity in category: 'Expected Identifier, received undefined' (invalid_type).",
        )
      })
    })
    describe('Given an invalid slug', () => {
      test('Then an error result is returned', () => {
        let categoryResult = newCategory({
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          slug: undefined,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe("Invalid prop slug in category: 'Required' (invalid_type).")

        categoryResult = newCategory({
          ...createDetails,
          slug: '',
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop slug in category: 'Should be at least 1 characters' (too_small).",
        )

        categoryResult = newCategory({
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          slug: 5,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop slug in category: 'Expected string, received number' (invalid_type).",
        )
      })
    })
    describe('Given an invalid previous slugs', () => {
      test('Then an error result is returned', () => {
        let categoryResult = newCategory({
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          previousSlugs: undefined,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe("Invalid prop previousSlugs in category: 'Required' (invalid_type).")

        categoryResult = newCategory({
          ...createDetails,
          previousSlugs: [''],
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop previousSlugs.0 in category: 'Should be at least 1 characters' (too_small).",
        )

        categoryResult = newCategory({
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          previousSlugs: [5],
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop previousSlugs.0 in category: 'Expected string, received number' (invalid_type).",
        )
      })
    })
    describe('Given an invalid name', () => {
      test('Then an error result is returned', () => {
        let categoryResult = newCategory({
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          name: undefined,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe("Invalid prop name in category: 'Required' (invalid_type).")

        categoryResult = newCategory({
          ...createDetails,
          name: 'x',
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop name in category: 'Should be at least 2 characters' (too_small).",
        )

        categoryResult = newCategory({
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          name: 5,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop name in category: 'Expected string, received number' (invalid_type).",
        )
      })
    })
    describe('Given an invalid description', () => {
      describe('and the description is too short', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory({
            ...createDetails,
            description: 'x',
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe(
            "Invalid prop description in category: 'Should be at least 2 characters' (too_small).",
          )
        })
      })
      describe('and the description is not a string', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory({
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            description: 5,
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe(
            "Invalid prop description in category: 'Expected string, received number' (invalid_type).",
          )
        })
      })
    })
    describe('Given an invalid short description', () => {
      describe('and the short description is not provided', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory({
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            shortDescription: undefined,
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe("Invalid prop shortDescription in category: 'Required' (invalid_type).")
        })
      })
      describe('and the short description is too short', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory({
            ...createDetails,
            shortDescription: 'x',
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe(
            "Invalid prop shortDescription in category: 'Should be at least 2 characters' (too_small).",
          )
        })
      })
    })
    describe('Given an invalid children', () => {
      test('Then an error result is returned', () => {
        let categoryResult = newCategory({
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          children: undefined,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe("Invalid prop children in category: 'Required' (invalid_type).")

        categoryResult = newCategory({
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          children: [{ other: 'object' }],
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop children.0.__entity in category: 'Expected Category, received undefined' (invalid_type).",
        )
      })
    })
    describe('Given an invalid parent', () => {
      test('Then an error result is returned', () => {
        const categoryResult = newCategory({
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          parent: { other: 'object' },
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toBe(
          "Invalid prop parent.__entity in category: 'Expected Category, received undefined' (invalid_type).",
        )
      })
    })
    describe('Given an invalid updated', () => {
      describe('and updated is not provided', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory({
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            updated: undefined,
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe("Invalid prop updated in category: 'Required' (invalid_type).")
        })
      })
      describe('and updated is not a Date', () => {
        test('Then an error result is returned', () => {
          const categoryResult = newCategory({
            ...createDetails,
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            updated: '',
          })
          assertResultError(categoryResult)
          expect(categoryResult.message).toBe(
            "Invalid prop updated in category: 'Expected date, received string' (invalid_type).",
          )
        })
      })
    })
  })
})
describe('isCategory', () => {
  describe('Given a category created from the factory', () => {
    let createDetails: CreateDetails
    let updated: Date
    let id: Identifier
    beforeEach(() => {
      updated = new Date()
      id = {
        __entity: 'Identifier',
        val: 'id',
      }
      createDetails = {
        id,
        slug: 'slug',
        previousSlugs: [],
        name: 'name',
        description: undefined,
        shortDescription: 'short description',
        parent: undefined,
        children: [],
        updated,
      }
    })
    describe('When called', () => {
      test('Then it returns true', () => {
        const result = newCategory(createDetails)
        assertResultOk(result)
        expect(isCategory(result.value)).toBe(true)
      })
    })
    describe('Given a category manually constructed', () => {
      describe('When called', () => {
        test('Then it returns true', () => {
          const category: Category = {
            __entity: 'Category',
            id,
            slug: 'slug',
            previousSlugs: [],
            name: 'name',
            description: undefined,
            shortDescription: 'short description',
            parent: undefined,
            children: [],
            updated,
          }
          expect(isCategory(category)).toBe(true)
        })
      })
      describe('and the __entity property is missing', () => {
        describe('When called', () => {
          test('Then it returns false', () => {
            // @ts-expect-error: In the domain we want to protect against runtime type errors
            const category: Category = {
              id,
              slug: 'slug',
              name: 'name',
              description: undefined,
              shortDescription: 'short description',
              parent: undefined,
              children: [],
              updated,
            }
            expect(isCategory(category)).toBe(false)
          })
        })
      })
    })
    describe('Given a non-category object', () => {
      describe('When called', () => {
        test('Then it returns false', () => {
          expect(
            isCategory({
              id,
              name: 'name',
            }),
          ).toBe(false)
        })
      })
    })
    describe('Given a primative', () => {
      describe('When called', () => {
        test('Then it returns false', () => {
          expect(isCategory(5)).toBe(false)
        })
      })
    })
  })
})
