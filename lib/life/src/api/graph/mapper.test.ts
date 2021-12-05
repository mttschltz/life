import { newGraphMapper } from './mapper'
import type { Category as CategoryUsecase } from '@life/usecase/mapper'
import { Category } from '@life/__generated__/graphql'
import { assertResultOk } from '@util/testing'

describe('GraphMapper', () => {
  describe('categoryFromUsecase', () => {
    describe('Given a usecase category without optional fields', () => {
      describe('When it successfully maps', () => {
        test('Then the graph category result is returned', () => {
          const mapper = newGraphMapper(jest.fn())
          const usecaseCategory: CategoryUsecase = {
            id: 'the id',
            name: 'the name',
            path: 'the path',
            children: [],
          }
          const result = mapper.categoryFromUsecase(usecaseCategory)
          assertResultOk(result)
          expect(result.value).toEqual({
            id: 'the id',
            name: 'the name',
            path: 'the path',
            children: [],
          } as Category)
        })
      })
    })
    describe('Given a usecase category with all fields', () => {
      describe('When it successfully maps', () => {
        test('Then the graph category result is returned', () => {
          const mapper = newGraphMapper(jest.fn())
          const usecaseCategory: CategoryUsecase = {
            id: 'the id',
            name: 'the name',
            path: 'the path',
            description: 'the description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              children: [],
            },
            children: [
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
            ],
          }
          const result = mapper.categoryFromUsecase(usecaseCategory)
          assertResultOk(result)
          expect(result.value).toEqual({
            id: 'the id',
            name: 'the name',
            path: 'the path',
            description: 'the description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              children: [],
            },
            children: [
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
            ],
          } as Category)
        })
      })
    })
  })
  describe('categoriesFromUsecase', () => {
    describe('Given multiple usecase categories', () => {
      describe('When they successfully map', () => {
        test('Then the graph category results are returned', () => {
          const mapper = newGraphMapper(jest.fn())
          const usecaseCategory1: CategoryUsecase = {
            id: 'the id 1',
            name: 'the name 1',
            path: 'the path 1',
            children: [],
          }
          const usecaseCategory2: CategoryUsecase = {
            id: 'the id 2',
            name: 'the name 2',
            path: 'the path 2',
            description: 'the description 2',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              children: [],
            },
            children: [
              {
                id: 'child1 id',
                name: 'child1 name',
                path: 'child1 path',
                description: 'child1 description',
                children: [],
              },
              {
                id: 'child2 id',
                name: 'child2 name',
                path: 'child2 path',
                description: 'child2 description',
                children: [],
              },
            ],
          }
          const results = mapper.categoriesFromUsecase([usecaseCategory1, usecaseCategory2])
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(2)
          expect(results.okValues).toEqual([
            {
              id: 'the id 1',
              name: 'the name 1',
              path: 'the path 1',
              children: [],
            },
            {
              id: 'the id 2',
              name: 'the name 2',
              path: 'the path 2',
              description: 'the description 2',
              parent: {
                id: 'parent id',
                name: 'parent name',
                path: 'parent path',
                description: 'parent description',
                children: [],
              },
              children: [
                {
                  id: 'child1 id',
                  name: 'child1 name',
                  path: 'child1 path',
                  description: 'child1 description',
                  children: [],
                },
                {
                  id: 'child2 id',
                  name: 'child2 name',
                  path: 'child2 path',
                  description: 'child2 description',
                  children: [],
                },
              ],
            },
          ])
        })
      })
    })
  })
})
