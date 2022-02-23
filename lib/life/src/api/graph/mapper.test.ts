import { newMapper } from './mapper'
import type { Category as CategoryUsecase, Risk as RiskUsecase, Updated as UpdatedUsecase } from '@life/usecase/mapper'
import { Category, CategoryTopLevel, Impact, Likelihood, Risk, RiskType } from '@life/__generated__/graphql'
import { Updatable } from '@life/updated'

describe('GraphMapper', () => {
  describe('categoryFromUsecase', () => {
    describe('Given a usecase category without optional fields', () => {
      test('Then it returns the mapped category', () => {
        const mapper = newMapper(jest.fn())
        const updated = new Date()
        const usecaseCategory: CategoryUsecase = {
          id: 'the id',
          name: 'the name',
          slug: 'the slug',
          previousSlugs: [],
          path: '/path',
          previousPaths: [],
          shortDescription: 'short description',
          children: [],
          updated,
        }
        const result = mapper.categoryFromUsecase(usecaseCategory)
        expect(result).toEqual({
          id: 'the id',
          name: 'the name',
          slug: 'the slug',
          previousSlugs: [],
          shortDescription: 'short description',
          children: [],
          updated,
        } as Category)
      })
    })
    describe('Given a usecase category with all fields', () => {
      test('Then it returns the mapped category', () => {
        const mapper = newMapper(jest.fn())
        const categoryUpdated = new Date('1995-12-17')
        const parentUpdated = new Date('1995-12-18')
        const child1Updated = new Date('1995-12-19')
        const child2Updated = new Date('1995-12-20')
        const usecaseCategory: CategoryUsecase = {
          id: 'the id',
          name: 'the name',
          slug: 'the slug',
          previousSlugs: ['the', 'previous', 'slugs'],
          path: '/path',
          previousPaths: ['/prev1', '/prev2'],
          description: 'the description',
          shortDescription: 'short description',
          parent: {
            id: 'parent id',
            name: 'parent name',
            slug: 'parent slug',
            previousSlugs: [],
            path: '/parent path',
            previousPaths: ['/parent prev1', '/parent prev2'],
            description: 'parent description',
            shortDescription: 'parent short description',
            children: [],
            updated: parentUpdated,
          },
          children: [
            {
              id: 'child1 id',
              name: 'child1 name',
              slug: 'child1 slug',
              previousSlugs: [],
              path: '/child1 path',
              previousPaths: ['/child1 prev1', '/child1 prev2'],
              shortDescription: 'child1 short description',
              children: [],
              updated: child1Updated,
            },
            {
              id: 'child2 id',
              name: 'child2 name',
              slug: 'child2 slug',
              previousSlugs: [],
              path: '/child2 path',
              previousPaths: ['/child2 prev1', '/child2 prev2'],
              shortDescription: 'child2 short description',
              children: [],
              updated: child2Updated,
            },
          ],
          updated: categoryUpdated,
        }
        const result = mapper.categoryFromUsecase(usecaseCategory)
        expect(result).toEqual({
          id: 'the id',
          name: 'the name',
          slug: 'the slug',
          previousSlugs: ['the', 'previous', 'slugs'],
          description: 'the description',
          shortDescription: 'short description',
          parent: {
            id: 'parent id',
            name: 'parent name',
            slug: 'parent slug',
            previousSlugs: [],
            description: 'parent description',
            shortDescription: 'parent short description',
            children: [],
            updated: parentUpdated,
          },
          children: [
            {
              id: 'child1 id',
              name: 'child1 name',
              slug: 'child1 slug',
              previousSlugs: [],
              shortDescription: 'child1 short description',
              children: [],
              updated: child1Updated,
            },
            {
              id: 'child2 id',
              name: 'child2 name',
              slug: 'child2 slug',
              previousSlugs: [],
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
  describe('categoriesFromUsecase', () => {
    describe('Given multiple usecase categories', () => {
      test('Then it returns the mapped categories', () => {
        const mapper = newMapper(jest.fn())
        const category1Updated = new Date('1995-12-16')
        const category2Updated = new Date('1995-12-17')
        const parentUpdated = new Date('1995-12-18')
        const child1Updated = new Date('1995-12-19')
        const child2Updated = new Date('1995-12-20')
        const usecaseCategory1: CategoryUsecase = {
          id: 'the id 1',
          name: 'the name 1',
          slug: 'the slug 1',
          previousSlugs: [],
          path: '/path 1',
          previousPaths: ['/prev1 1', '/prev2 1'],
          shortDescription: 'the short description 1',
          children: [],
          updated: category1Updated,
        }
        const usecaseCategory2: CategoryUsecase = {
          id: 'the id 2',
          name: 'the name 2',
          slug: 'the slug 2',
          previousSlugs: [],
          path: '/path 2',
          previousPaths: ['/prev1 2', '/prev2 2'],
          description: 'the description 2',
          shortDescription: 'the short description 2',
          parent: {
            id: 'parent id',
            name: 'parent name',
            slug: 'parent slug',
            previousSlugs: [],
            path: '/parent path',
            previousPaths: ['/parent prev1', '/parent prev2'],
            description: 'parent description',
            shortDescription: 'parent short description',
            children: [],
            updated: parentUpdated,
          },
          children: [
            {
              id: 'child1 id',
              name: 'child1 name',
              slug: 'child1 slug',
              previousSlugs: [],
              path: '/child1 path',
              previousPaths: ['/child1 prev1', '/child1 prev2'],
              description: 'child1 description',
              shortDescription: 'child1 short description',
              children: [],
              updated: child1Updated,
            },
            {
              id: 'child2 id',
              name: 'child2 name',
              slug: 'child2 slug',
              previousSlugs: [],
              path: '/child2 path',
              previousPaths: ['/child2 prev1', '/child2 prev2'],
              description: 'child2 description',
              shortDescription: 'child2 short description',
              children: [],
              updated: child2Updated,
            },
          ],
          updated: category2Updated,
        }
        const results = mapper.categoriesFromUsecase([usecaseCategory1, usecaseCategory2])
        expect(results).toEqual([
          {
            id: 'the id 1',
            name: 'the name 1',
            slug: 'the slug 1',
            previousSlugs: [],
            shortDescription: 'the short description 1',
            children: [],
            updated: category1Updated,
          },
          {
            id: 'the id 2',
            name: 'the name 2',
            slug: 'the slug 2',
            previousSlugs: [],
            description: 'the description 2',
            shortDescription: 'the short description 2',
            parent: {
              id: 'parent id',
              name: 'parent name',
              slug: 'parent slug',
              previousSlugs: [],
              description: 'parent description',
              shortDescription: 'parent short description',
              children: [],
              updated: parentUpdated,
            },
            children: [
              {
                id: 'child1 id',
                name: 'child1 name',
                slug: 'child1 slug',
                previousSlugs: [],
                description: 'child1 description',
                shortDescription: 'child1 short description',
                children: [],
                updated: child1Updated,
              },
              {
                id: 'child2 id',
                name: 'child2 name',
                slug: 'child2 slug',
                previousSlugs: [],
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
  describe('updatedFromUsecase', () => {
    describe('Given one updated usecase category and one updated usecase risk', () => {
      describe("When they don't have optional properties", () => {
        test('Then they are mapped to graph types', () => {
          const mapper = newMapper(jest.fn())
          const category: CategoryUsecase = {
            id: 'category id',
            name: 'category name',
            slug: 'category slug',
            previousSlugs: [],
            path: '/path',
            previousPaths: [],
            shortDescription: 'category short description',
            updated: new Date('2022-01-11'),
            children: [],
          }
          const risk: RiskUsecase = {
            id: 'risk id',
            name: 'risk name',
            category: 'Health',
            impact: 'High',
            likelihood: 'High',
            type: 'Condition',
            shortDescription: 'risk short description',
            updated: new Date('2022-01-12'),
          }
          const updated: UpdatedUsecase[] = [category, risk]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toEqual([
            {
              id: 'category id',
              name: 'category name',
              slug: 'category slug',
              previousSlugs: [],
              shortDescription: 'category short description',
              updated: new Date('2022-01-11'),
              children: [],
            } as Category,
            {
              id: 'risk id',
              name: 'risk name',
              category: CategoryTopLevel.Health,
              impact: Impact.High,
              likelihood: Likelihood.High,
              type: RiskType.Condition,
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            } as Risk,
          ])
        })
      })
      describe('When they have all optional properties', () => {
        test('Then they are mapped to graph types', () => {
          const mapper = newMapper(jest.fn().mockImplementation((mdx: string) => `transpiled ${mdx}`))
          const category: CategoryUsecase = {
            id: 'category id',
            name: 'category name',
            slug: 'category slug',
            previousSlugs: ['category', 'slug'],
            path: '/category path',
            previousPaths: ['/category prev1', '/category prev2'],
            shortDescription: 'category short description',
            updated: new Date('2022-01-11'),
            description: 'category description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              slug: 'parent slug',
              previousSlugs: ['parent category', 'parent slug'],
              path: '/parent path',
              previousPaths: ['/parent prev1', '/parent prev2'],
              shortDescription: 'parent short description',
              updated: new Date('2022-01-10'),
              children: [],
              description: 'parent description',
            },
            children: [
              {
                id: 'child id',
                name: 'child name',
                slug: 'child slug',
                previousSlugs: ['child category', 'child slug'],
                path: '/child path',
                previousPaths: ['/child prev1', '/child prev2'],
                shortDescription: 'child short description',
                updated: new Date('2022-01-09'),
                children: [],
                description: 'child description',
              },
            ],
          }
          const risk: RiskUsecase = {
            id: 'risk id',
            name: 'risk name',
            category: 'Health',
            impact: 'High',
            likelihood: 'High',
            type: 'Condition',
            shortDescription: 'risk short description',
            updated: new Date('2022-01-12'),
            notes: 'risk notes',
            parent: {
              id: 'risk parent id',
              name: 'risk parent name',
              category: 'Health',
              impact: 'High',
              likelihood: 'High',
              type: 'Condition',
              shortDescription: 'risk parent short description',
              updated: new Date('2022-01-13'),
              notes: 'risk parent notes',
            },
          }
          const updated: UpdatedUsecase[] = [category, risk]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toEqual([
            {
              id: 'category id',
              name: 'category name',
              slug: 'category slug',
              previousSlugs: ['category', 'slug'],
              shortDescription: 'category short description',
              updated: new Date('2022-01-11'),
              description: 'category description',
              parent: {
                id: 'parent id',
                name: 'parent name',
                slug: 'parent slug',
                previousSlugs: ['parent category', 'parent slug'],
                shortDescription: 'parent short description',
                updated: new Date('2022-01-10'),
                children: [],
                description: 'parent description',
              },
              children: [
                {
                  id: 'child id',
                  name: 'child name',
                  slug: 'child slug',
                  previousSlugs: ['child category', 'child slug'],
                  shortDescription: 'child short description',
                  updated: new Date('2022-01-09'),
                  children: [],
                  description: 'child description',
                },
              ],
            } as Category,
            {
              id: 'risk id',
              name: 'risk name',
              category: CategoryTopLevel.Health,
              impact: Impact.High,
              likelihood: Likelihood.High,
              type: RiskType.Condition,
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
              notes: 'transpiled risk notes',
              parent: {
                id: 'risk parent id',
                name: 'risk parent name',
                category: CategoryTopLevel.Health,
                impact: Impact.High,
                likelihood: Likelihood.High,
                type: RiskType.Condition,
                shortDescription: 'risk parent short description',
                updated: new Date('2022-01-13'),
                notes: 'transpiled risk parent notes',
              },
            } as Risk,
          ])
        })
      })
    })
    describe('Given an empty array', () => {
      test('Then it returns an empty result', () => {
        const mapper = newMapper(jest.fn())
        const mapperResults = mapper.updatedFromUsecase([])
        expect(mapperResults.firstErrorResult).toBeUndefined()
        expect(mapperResults.okValues).toEqual([])
      })
    })
    describe('Given an updated usecase risk', () => {
      describe('When it has a health category', () => {
        test('Then it is mapped to the graph health category', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Health',
              impact: 'High',
              likelihood: 'High',
              type: 'Condition',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).category).toEqual(CategoryTopLevel.Health)
        })
      })
      describe('When it has a wealth category', () => {
        test('Then it is mapped to the graph wealth category', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Wealth',
              impact: 'High',
              likelihood: 'High',
              type: 'Condition',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).category).toEqual(CategoryTopLevel.Wealth)
        })
      })
      describe('When it has a security category', () => {
        test('Then it is mapped to the graph security category', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Security',
              impact: 'High',
              likelihood: 'High',
              type: 'Condition',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).category).toEqual(CategoryTopLevel.Security)
        })
      })
      describe('When it has a high impact', () => {
        test('Then it is mapped to the graph high impact', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Health',
              impact: 'High',
              likelihood: 'High',
              type: 'Condition',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).impact).toEqual(Impact.High)
        })
      })
      describe('When it has a normal impact', () => {
        test('Then it is mapped to the graph normal impact', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Health',
              impact: 'Normal',
              likelihood: 'High',
              type: 'Condition',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).impact).toEqual(Impact.Normal)
        })
      })
      describe('When it has a high likelihood', () => {
        test('Then it is mapped to the graph high likelihood', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Health',
              impact: 'High',
              likelihood: 'High',
              type: 'Condition',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).likelihood).toEqual(Likelihood.High)
        })
      })
      describe('When it has a low likelihood', () => {
        test('Then it is mapped to the graph low likelihood', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Health',
              impact: 'High',
              likelihood: 'Normal',
              type: 'Condition',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).likelihood).toEqual(Likelihood.Normal)
        })
      })
      describe('When it has a risk type of condition', () => {
        test('Then it is mapped to the graph risk type of condition', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Health',
              impact: 'High',
              likelihood: 'High',
              type: 'Condition',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).type).toEqual(RiskType.Condition)
        })
      })
      describe('When it has a risk type of goal', () => {
        test('Then it is mapped to the graph risk type of goal', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Health',
              impact: 'High',
              likelihood: 'High',
              type: 'Goal',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).type).toEqual(RiskType.Goal)
        })
      })
      describe('When it has a risk type of risk', () => {
        test('Then it is mapped to the graph risk type of risk', () => {
          const mapper = newMapper(jest.fn())
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Health',
              impact: 'High',
              likelihood: 'High',
              type: 'Risk',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).type).toEqual(RiskType.Risk)
        })
      })
      describe('When it has notes', () => {
        test('Then the notes are transpiled', () => {
          const mapper = newMapper(jest.fn().mockImplementation((mdx: string) => `transpiled ${mdx}`))
          const updated: UpdatedUsecase[] = [
            {
              id: 'risk id',
              name: 'risk name',
              category: 'Health',
              impact: 'High',
              likelihood: 'High',
              type: 'Risk',
              shortDescription: 'risk short description',
              updated: new Date('2022-01-12'),
              notes: 'source notes',
            },
          ]
          const results = mapper.updatedFromUsecase(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(1)
          expect((results.okValues[0] as Risk).notes).toBe('transpiled source notes')
        })
      })
    })
    describe('Given an unknown updated entity', () => {
      test('Then an error result is returned', () => {
        interface UnknownUpdated extends Updatable {
          prop: string
        }
        const unknownUpdated: UnknownUpdated = {
          id: { __entity: 'Identifier', val: 'id' },
          name: 'name',
          prop: 'value',
          shortDescription: 'short description',
          updated: new Date('2022-01-14'),
        }
        const mapper = newMapper(jest.fn())
        // @ts-expect-error: We're testing for future types of Updatable
        const results = mapper.updatedFromUsecase([unknownUpdated])
        expect(results.firstErrorResult).toBeDefined()
        expect(results.firstErrorResult).toEqualResultError({
          message: 'Unhandled Updated usecase type',
        })
      })
    })
  })
  describe('isUpdatedCategory', () => {
    describe('Given a Category', () => {
      describe('When it has required properties', () => {
        test('Then it returns true', () => {
          const mapper = newMapper(jest.fn())
          const category: Category = {
            id: 'an id',
            name: 'a name',
            slug: 'a slug',
            previousSlugs: [],
            shortDescription: 'a short description',
            updated: new Date('2022-01-15'),
            children: [],
          }
          expect(mapper.isUpdatedCategory(category)).toBe(true)
        })
      })
      describe('When it has all properties', () => {
        test('Then it returns true', () => {
          const category: Category = {
            id: 'an id',
            name: 'a name',
            slug: 'a slug',
            previousSlugs: ['category', 'slug'],
            shortDescription: 'a short description',
            updated: new Date('2022-01-15'),
            children: [],
            description: 'a description',
            parent: {
              id: 'an id',
              name: 'a name',
              slug: 'a slug',
              previousSlugs: ['category', 'slug'],
              shortDescription: 'a short description',
              updated: new Date('2022-01-15'),
              children: [],
              description: 'a description',
            },
          }
          const mapper = newMapper(jest.fn())
          expect(mapper.isUpdatedCategory(category)).toBe(true)
        })
      })
    })
    describe('Given a Risk', () => {
      describe('When it has required properties', () => {
        test('Then it returns false', () => {
          const risk: Risk = {
            id: 'an id',
            category: CategoryTopLevel.Health,
            impact: Impact.High,
            likelihood: Likelihood.High,
            name: 'a name',
            shortDescription: 'a short description',
            type: RiskType.Condition,
            updated: new Date('2022-01-15'),
          }
          const mapper = newMapper(jest.fn())
          expect(mapper.isUpdatedCategory(risk)).toBe(false)
        })
      })
      describe('When it has all properties', () => {
        test('Then it returns false', () => {
          const risk: Risk = {
            id: 'an id',
            category: CategoryTopLevel.Health,
            impact: Impact.High,
            likelihood: Likelihood.High,
            name: 'a name',
            shortDescription: 'a short description',
            type: RiskType.Condition,
            updated: new Date('2022-01-15'),
            notes: 'some notes',
            parent: {
              id: 'an id',
              category: CategoryTopLevel.Health,
              impact: Impact.High,
              likelihood: Likelihood.High,
              name: 'a name',
              shortDescription: 'a short description',
              type: RiskType.Condition,
              updated: new Date('2022-01-15'),
              notes: 'some notes',
            },
          }
          const mapper = newMapper(jest.fn())
          expect(mapper.isUpdatedCategory(risk)).toBe(false)
        })
      })
    })
  })
  describe('isUpdatedRisk', () => {
    describe('Given a Risk', () => {
      describe('When it has required properties', () => {
        test('Then it returns true', () => {
          const risk: Risk = {
            id: 'an id',
            category: CategoryTopLevel.Health,
            impact: Impact.High,
            likelihood: Likelihood.High,
            name: 'a name',
            shortDescription: 'a short description',
            type: RiskType.Condition,
            updated: new Date('2022-01-15'),
          }
          const mapper = newMapper(jest.fn())
          expect(mapper.isUpdatedRisk(risk)).toBe(true)
        })
      })
      describe('When it has all properties', () => {
        test('Then it returns true', () => {
          const risk: Risk = {
            id: 'an id',
            category: CategoryTopLevel.Health,
            impact: Impact.High,
            likelihood: Likelihood.High,
            name: 'a name',
            shortDescription: 'a short description',
            type: RiskType.Condition,
            updated: new Date('2022-01-15'),
            notes: 'some notes',
            parent: {
              id: 'an id',
              category: CategoryTopLevel.Health,
              impact: Impact.High,
              likelihood: Likelihood.High,
              name: 'a name',
              shortDescription: 'a short description',
              type: RiskType.Condition,
              updated: new Date('2022-01-15'),
              notes: 'some notes',
            },
          }
          const mapper = newMapper(jest.fn())
          expect(mapper.isUpdatedRisk(risk)).toBe(true)
        })
      })
    })
    describe('Given a Category', () => {
      describe('When it has required properties', () => {
        test('Then it returns false', () => {
          const mapper = newMapper(jest.fn())
          const category: Category = {
            id: 'an id',
            name: 'a name',
            slug: 'a slug',
            previousSlugs: ['previous', 'slugs'],
            shortDescription: 'a short description',
            updated: new Date('2022-01-15'),
            children: [],
          }
          expect(mapper.isUpdatedRisk(category)).toBe(false)
        })
      })
      describe('When it has all properties', () => {
        test('Then it returns false', () => {
          const category: Category = {
            id: 'an id',
            name: 'a name',
            slug: 'a slug',
            previousSlugs: ['previous', 'slugs'],
            shortDescription: 'a short description',
            updated: new Date('2022-01-15'),
            children: [],
            description: 'a description',
            parent: {
              id: 'an id',
              name: 'a name',
              slug: 'a slug',
              previousSlugs: ['previous', 'slugs'],
              shortDescription: 'a short description',
              updated: new Date('2022-01-15'),
              children: [],
              description: 'a description',
            },
          }
          const mapper = newMapper(jest.fn())
          expect(mapper.isUpdatedRisk(category)).toBe(false)
        })
      })
    })
  })
})
