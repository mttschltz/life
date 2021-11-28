import { newCategory, Category } from '@life/category'
import type { CreateDetails } from '@life/category'
import { describe, expect, test } from '@jest/globals'
import { assertResultError, assertResultOk } from '@util/testing'

describe('Category', () => {
  describe('Create', () => {
    let createDetails: CreateDetails
    beforeEach(() => {
      createDetails = {
        path: 'path',
        name: 'name',
        description: undefined,
        parent: undefined,
        children: [],
      }
    })

    describe('Given a valid CreateDetails without optional fields', () => {
      describe('When there are no optional fields', () => {
        // TODO:
        test('Then it successfully creates a Category', () => {
          const categoryResult = newCategory('id', {
            ...createDetails,
          })
          assertResultOk(categoryResult)

          const category = categoryResult.value
          expect(category.id).toEqual('id')
          expect(category.path).toEqual('path')
          expect(category.name).toEqual('name')
          expect(category.description).toBeUndefined()
          expect(category.parent).toBeUndefined()
          expect(category.children).toHaveLength(0)
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
        }
        const children: Category[] = [
          {
            id: 'child id',
            children: [],
            name: 'child name',
            path: 'child path',
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
        expect(category.id).toEqual('id')
        expect(category.path).toEqual('path')
        expect(category.name).toEqual('name')
        expect(category.description).toEqual('description')
        expect(category.parent).toBe(parent)
        expect(category.children).toBe(children)
      })
    })
    describe('Given an invalid CreateDetails', () => {
      test('Then an error result is returned', () => {
        // @ts-expect-error: In the domain we want to protect against runtime type errors
        expect(() => newCategory('id', undefined)).toThrow()

        // @ts-expect-error: In the domain we want to protect against runtime type errors
        const categoryResult = newCategory('id', {})
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('children must be an array of Categorys')
      })
    })
    describe('Given an invalid id', () => {
      test('Then an error result is returned', () => {
        // @ts-expect-error: In the domain we want to protect against runtime type errors
        let categoryResult = newCategory(undefined, createDetails)
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('id must be a string')

        categoryResult = newCategory('', createDetails)
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('id must be longer than or equal to 1 characters')

        // @ts-expect-error: In the domain we want to protect against runtime type errors
        categoryResult = newCategory(5, createDetails)
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('id must be a string')
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
        expect(categoryResult.message).toEqual('path must be a string')

        categoryResult = newCategory('id', {
          ...createDetails,
          path: '',
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('path must be longer than or equal to 1 characters')

        categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          path: 5,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('path must be a string')
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
        expect(categoryResult.message).toEqual('name must be a string')

        categoryResult = newCategory('id', {
          ...createDetails,
          name: 'x',
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('name must be longer than or equal to 2 characters')

        categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          name: 5,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('name must be a string')
      })
    })
    describe('Given an invalid description', () => {
      test('Then an error result is returned', () => {
        const categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          description: 5,
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('description must be a string')
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
        expect(categoryResult.message).toEqual('children must be an array of Categorys')

        categoryResult = newCategory('id', {
          ...createDetails,
          // @ts-expect-error: In the domain we want to protect against runtime type errors
          children: [{ other: 'object' }],
        })
        assertResultError(categoryResult)
        expect(categoryResult.message).toEqual('children must be an array of Categorys')
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
        expect(categoryResult.message).toEqual('parent must be a Category')
      })
    })
  })
})