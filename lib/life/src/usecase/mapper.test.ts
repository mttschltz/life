import { Category as CategoryDomain } from '@life/category'
import { CategoryMapper } from './mapper'

describe('CategoryMapper', () => {
  describe('category', () => {
    describe('Given a category', () => {
      describe('When there are no parents and children', () => {
        test('Then it is mapped correctly', () => {
          const categoryUpdated = new Date()
          const categoryDomain: CategoryDomain = {
            id: 'id',
            name: 'name',
            path: 'path',
            description: 'description',
            shortDescription: 'short description',
            children: [],
            updated: categoryUpdated,
          }
          const mapper = new CategoryMapper()
          expect(mapper.category(categoryDomain)).toEqual({
            id: 'id',
            name: 'name',
            path: 'path',
            description: 'description',
            shortDescription: 'short description',
            children: [],
            updated: categoryUpdated,
          } as CategoryDomain)
        })
      })
      describe('When there are recursive parents and children', () => {
        test('Then it is mapped correctly', () => {
          const categoryUpdated = new Date()
          const parentUpdated = new Date()
          const grandparentUpdated = new Date()
          const childUpdated = new Date()
          const grandchildUpdated = new Date()
          const categoryDomain: CategoryDomain = {
            id: 'id',
            name: 'name',
            path: 'path',
            description: 'description',
            shortDescription: 'short description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              shortDescription: 'parent short description',
              parent: {
                id: 'grandparent id',
                name: 'grandparent name',
                path: 'grandparent path',
                description: 'grandparent description',
                shortDescription: 'grandparent short description',
                children: [
                  {
                    id: 'parent id',
                    name: 'parent name',
                    path: 'parent path',
                    description: 'parent description',
                    shortDescription: 'parent short description',
                    children: [],
                    updated: parentUpdated,
                  },
                ],
                updated: grandparentUpdated,
              },
              children: [
                {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  description: 'description',
                  shortDescription: 'short description',
                  children: [],
                  updated: categoryUpdated,
                },
              ],
              updated: parentUpdated,
            },
            children: [
              {
                id: 'child id',
                name: 'child name',
                path: 'child path',
                description: 'child description',
                shortDescription: 'child short description',
                parent: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  description: 'description',
                  shortDescription: 'short description',
                  children: [],
                  updated: categoryUpdated,
                },
                children: [
                  {
                    id: 'grandchild id',
                    name: 'grandchild name',
                    path: 'grandchild path',
                    description: 'grandchild description',
                    shortDescription: 'grandchild short description',
                    children: [],
                    updated: grandchildUpdated,
                  },
                ],
                updated: childUpdated,
              },
            ],
            updated: categoryUpdated,
          }
          const mapper = new CategoryMapper()
          expect(mapper.category(categoryDomain)).toEqual({
            id: 'id',
            name: 'name',
            path: 'path',
            description: 'description',
            shortDescription: 'short description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              shortDescription: 'parent short description',
              parent: {
                id: 'grandparent id',
                name: 'grandparent name',
                path: 'grandparent path',
                description: 'grandparent description',
                shortDescription: 'grandparent short description',
                children: [
                  {
                    id: 'parent id',
                    name: 'parent name',
                    path: 'parent path',
                    description: 'parent description',
                    shortDescription: 'parent short description',
                    children: [],
                    updated: parentUpdated,
                  },
                ],
                updated: grandparentUpdated,
              },
              children: [
                {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  description: 'description',
                  shortDescription: 'short description',
                  children: [],
                  updated: categoryUpdated,
                },
              ],
              updated: parentUpdated,
            },
            children: [
              {
                id: 'child id',
                name: 'child name',
                path: 'child path',
                description: 'child description',
                shortDescription: 'child short description',
                parent: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  description: 'description',
                  shortDescription: 'short description',
                  children: [],
                  updated: categoryUpdated,
                },
                children: [
                  {
                    id: 'grandchild id',
                    name: 'grandchild name',
                    path: 'grandchild path',
                    description: 'grandchild description',
                    shortDescription: 'grandchild short description',
                    children: [],
                    updated: grandchildUpdated,
                  },
                ],
                updated: childUpdated,
              },
            ],
            updated: categoryUpdated,
          } as CategoryDomain)
        })
      })
    })
  })
  describe('categories', () => {
    describe('Given no categories', () => {
      test('Then it is mapped correctly', () => {
        const mapper = new CategoryMapper()
        expect(mapper.categories([])).toEqual([])
      })
    })
    describe('Given multiple categories', () => {
      test('Then they are mapped correctly', () => {
        const updated1 = new Date()
        const updated2 = new Date()
        const categoryDomains: CategoryDomain[] = [
          {
            id: 'id 1',
            name: 'name 1',
            path: 'path 1',
            description: 'description 1',
            shortDescription: 'short description 1',
            children: [],
            updated: updated1,
          },
          {
            id: 'id 2',
            name: 'name 2',
            path: 'path 2',
            description: 'description 2',
            shortDescription: 'short description 2',
            children: [],
            updated: updated2,
          },
        ]
        const mapper = new CategoryMapper()
        expect(mapper.categories(categoryDomains)).toEqual([
          {
            id: 'id 1',
            name: 'name 1',
            path: 'path 1',
            description: 'description 1',
            shortDescription: 'short description 1',
            children: [],
            updated: updated1,
          },
          {
            id: 'id 2',
            name: 'name 2',
            path: 'path 2',
            description: 'description 2',
            shortDescription: 'short description 2',
            children: [],
            updated: updated2,
          },
        ])
      })
    })
  })
})
