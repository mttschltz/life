import { Category as CategoryDomain } from '@life/category'
import { CategoryMapper } from './mapper'

describe('CategoryMapper', () => {
  describe('category', () => {
    describe('Given a category', () => {
      describe('When there are no parents and children', () => {
        test('Then it is mapped correctly', () => {
          const categoryDomain: CategoryDomain = {
            id: 'id',
            name: 'name',
            path: 'path',
            description: 'description',
            children: [],
          }
          const mapper = new CategoryMapper()
          expect(mapper.category(categoryDomain)).toEqual({
            id: 'id',
            name: 'name',
            path: 'path',
            description: 'description',
            children: [],
          } as CategoryDomain)
        })
      })
      describe('When there are recursive parents and children', () => {
        test('Then it is mapped correctly', () => {
          const categoryDomain: CategoryDomain = {
            id: 'id',
            name: 'name',
            path: 'path',
            description: 'description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              parent: {
                id: 'grandparent id',
                name: 'grandparent name',
                path: 'grandparent path',
                description: 'grandparent description',
                children: [
                  {
                    id: 'parent id',
                    name: 'parent name',
                    path: 'parent path',
                    description: 'parent description',
                    children: [],
                  },
                ],
              },
              children: [
                {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  description: 'description',
                  children: [],
                },
              ],
            },
            children: [
              {
                id: 'child id',
                name: 'child name',
                path: 'child path',
                description: 'child description',
                parent: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  description: 'description',
                  children: [],
                },
                children: [
                  {
                    id: 'grandchild id',
                    name: 'grandchild name',
                    path: 'grandchild path',
                    description: 'grandchild description',
                    children: [],
                  },
                ],
              },
            ],
          }
          const mapper = new CategoryMapper()
          expect(mapper.category(categoryDomain)).toEqual({
            id: 'id',
            name: 'name',
            path: 'path',
            description: 'description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              path: 'parent path',
              description: 'parent description',
              parent: {
                id: 'grandparent id',
                name: 'grandparent name',
                path: 'grandparent path',
                description: 'grandparent description',
                children: [
                  {
                    id: 'parent id',
                    name: 'parent name',
                    path: 'parent path',
                    description: 'parent description',
                    children: [],
                  },
                ],
              },
              children: [
                {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  description: 'description',
                  children: [],
                },
              ],
            },
            children: [
              {
                id: 'child id',
                name: 'child name',
                path: 'child path',
                description: 'child description',
                parent: {
                  id: 'id',
                  name: 'name',
                  path: 'path',
                  description: 'description',
                  children: [],
                },
                children: [
                  {
                    id: 'grandchild id',
                    name: 'grandchild name',
                    path: 'grandchild path',
                    description: 'grandchild description',
                    children: [],
                  },
                ],
              },
            ],
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
        const categoryDomains: CategoryDomain[] = [
          {
            id: 'id 1',
            name: 'name 1',
            path: 'path 1',
            description: 'description 1',
            children: [],
          },
          {
            id: 'id 2',
            name: 'name 2',
            path: 'path 2',
            description: 'description 2',
            children: [],
          },
        ]
        const mapper = new CategoryMapper()
        expect(mapper.categories(categoryDomains)).toEqual([
          {
            id: 'id 1',
            name: 'name 1',
            path: 'path 1',
            description: 'description 1',
            children: [],
          },
          {
            id: 'id 2',
            name: 'name 2',
            path: 'path 2',
            description: 'description 2',
            children: [],
          },
        ])
      })
    })
  })
})
