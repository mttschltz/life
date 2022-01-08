import { newMapper } from './mapper'
import type { Category as CategoryUsecase } from '@life/usecase/mapper'
import { Category } from '@life/__generated__/graphql'
import { assertResultOk } from '@util/testing'

describe('GraphMapper', () => {
  describe('categoryFromUsecase', () => {
    describe('Given a usecase category without optional fields', () => {
      describe('When it successfully maps', () => {
        test('Then the graph category result is returned', () => {
          const mapper = newMapper(jest.fn())
          const updated = new Date()
          const usecaseCategory: CategoryUsecase = {
            id: 'the id',
            name: 'the name',
            path: 'the path',
            shortDescription: 'short description',
            children: [],
            updated,
          }
          const result = mapper.categoryFromUsecase(usecaseCategory)
          assertResultOk(result)
          expect(result.value).toEqual({
            id: 'the id',
            name: 'the name',
            path: 'the path',
            shortDescription: 'short description',
            children: [],
            updated,
          } as Category)
        })
      })
    })
    describe('Given a usecase category with all fields', () => {
      describe('When it successfully maps', () => {
        test('Then the graph category result is returned', () => {
          const mapper = newMapper(jest.fn())
          const categoryUpdated = new Date('1995-12-17')
          const parentUpdated = new Date('1995-12-18')
          const child1Updated = new Date('1995-12-19')
          const child2Updated = new Date('1995-12-20')
          const usecaseCategory: CategoryUsecase = {
            id: 'the id',
            name: 'the name',
            path: 'the path',
            description: 'the description',
            shortDescription: 'short description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              shortDescription: 'parent short description',
              children: [],
              updated: parentUpdated,
            },
            children: [
              {
                id: 'child1 id',
                name: 'child1 name',
                path: 'child1 path',
                shortDescription: 'child1 short description',
                children: [],
                updated: child1Updated,
              },
              {
                id: 'child2 id',
                name: 'child2 name',
                path: 'child2 path',
                shortDescription: 'child2 short description',
                children: [],
                updated: child2Updated,
              },
            ],
            updated: categoryUpdated,
          }
          const result = mapper.categoryFromUsecase(usecaseCategory)
          assertResultOk(result)
          expect(result.value).toEqual({
            id: 'the id',
            name: 'the name',
            path: 'the path',
            description: 'the description',
            shortDescription: 'short description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              shortDescription: 'parent short description',
              children: [],
              updated: parentUpdated,
            },
            children: [
              {
                id: 'child1 id',
                name: 'child1 name',
                path: 'child1 path',
                shortDescription: 'child1 short description',
                children: [],
                updated: child1Updated,
              },
              {
                id: 'child2 id',
                name: 'child2 name',
                path: 'child2 path',
                shortDescription: 'child2 short description',
                children: [],
                updated: child2Updated,
              },
            ],
            updated: categoryUpdated,
          } as Category)
        })
      })
    })
  })
  describe('categoriesFromUsecase', () => {
    describe('Given multiple usecase categories', () => {
      describe('When they successfully map', () => {
        test('Then the graph category results are returned', () => {
          const mapper = newMapper(jest.fn())
          const category1Updated = new Date('1995-12-16')
          const category2Updated = new Date('1995-12-17')
          const parentUpdated = new Date('1995-12-18')
          const child1Updated = new Date('1995-12-19')
          const child2Updated = new Date('1995-12-20')
          const usecaseCategory1: CategoryUsecase = {
            id: 'the id 1',
            name: 'the name 1',
            path: 'the path 1',
            shortDescription: 'the short description 1',
            children: [],
            updated: category1Updated,
          }
          const usecaseCategory2: CategoryUsecase = {
            id: 'the id 2',
            name: 'the name 2',
            path: 'the path 2',
            description: 'the description 2',
            shortDescription: 'the short description 2',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              shortDescription: 'parent short description',
              children: [],
              updated: parentUpdated,
            },
            children: [
              {
                id: 'child1 id',
                name: 'child1 name',
                path: 'child1 path',
                description: 'child1 description',
                shortDescription: 'child1 short description',
                children: [],
                updated: child1Updated,
              },
              {
                id: 'child2 id',
                name: 'child2 name',
                path: 'child2 path',
                description: 'child2 description',
                shortDescription: 'child2 short description',
                children: [],
                updated: child2Updated,
              },
            ],
            updated: category2Updated,
          }
          const results = mapper.categoriesFromUsecase([usecaseCategory1, usecaseCategory2])
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(2)
          expect(results.okValues).toEqual([
            {
              id: 'the id 1',
              name: 'the name 1',
              path: 'the path 1',
              shortDescription: 'the short description 1',
              children: [],
              updated: category1Updated,
            },
            {
              id: 'the id 2',
              name: 'the name 2',
              path: 'the path 2',
              description: 'the description 2',
              shortDescription: 'the short description 2',
              parent: {
                id: 'parent id',
                name: 'parent name',
                path: 'parent path',
                description: 'parent description',
                shortDescription: 'parent short description',
                children: [],
                updated: parentUpdated,
              },
              children: [
                {
                  id: 'child1 id',
                  name: 'child1 name',
                  path: 'child1 path',
                  description: 'child1 description',
                  shortDescription: 'child1 short description',
                  children: [],
                  updated: child1Updated,
                },
                {
                  id: 'child2 id',
                  name: 'child2 name',
                  path: 'child2 path',
                  description: 'child2 description',
                  shortDescription: 'child2 short description',
                  children: [],
                  updated: child2Updated,
                },
              ],
              updated: category2Updated,
            },
          ] as Category[])
        })
      })
    })
  })
})
