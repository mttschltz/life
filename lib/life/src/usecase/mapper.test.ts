import { Category as CategoryDomain, newCategory } from '@life/category'
import {
  CategoryTopLevel as CategoryTopLevelDomain,
  Impact as ImpactDomain,
  Likelihood as LikelihoodDomain,
  Risk as RiskDomain,
  RiskType as RiskTypeDomain,
} from '@life/risk'
import { Updated as UpdatedDomain } from '@life/updated'
import { newCategoryMapper, newUpdatedMapper, Category, isUpdatedCategory, isUpdatedRisk } from './mapper'
import type { CategoryMapper, Risk, RiskMapper } from './mapper'
import { assertResultOk, mockThrows } from '@helper/testing'
import { newIdentifier } from '@helper/identifier'

describe('CategoryMapper', () => {
  describe('category', () => {
    describe('Given a category', () => {
      describe('When there are no parents and children', () => {
        test('Then it is mapped correctly', () => {
          const categoryUpdated = new Date()
          const idResult = newIdentifier('id')
          assertResultOk(idResult)

          const categoryResult = newCategory({
            id: idResult.value,
            name: 'name',
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            description: 'description',
            shortDescription: 'short description',
            children: [],
            updated: categoryUpdated,
          })
          assertResultOk(categoryResult)
          const categoryDomain = categoryResult.value

          const mapper = newCategoryMapper()
          expect(mapper.category(categoryDomain)).toEqual({
            id: 'id',
            name: 'name',
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            description: 'description',
            shortDescription: 'short description',
            parent: undefined,
            children: [],
            updated: categoryUpdated,
          } as Category)
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
            __entity: 'Category',
            id: { __entity: 'Identifier', val: 'id' },
            name: 'name',
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            description: 'description',
            shortDescription: 'short description',
            parent: {
              __entity: 'Category',
              id: { __entity: 'Identifier', val: 'parent id' },
              name: 'parent name',
              slug: 'parent slug',
              previousSlugs: ['parent prev', 'parent ious'],
              description: 'parent description',
              shortDescription: 'parent short description',
              parent: {
                __entity: 'Category',
                id: { __entity: 'Identifier', val: 'grandparent id' },
                name: 'grandparent name',
                slug: 'grandparent slug',
                previousSlugs: ['grandparent prev', 'grandparent ious'],
                description: 'grandparent description',
                shortDescription: 'grandparent short description',
                children: [
                  {
                    __entity: 'Category',
                    id: { __entity: 'Identifier', val: 'parent id' },
                    name: 'parent name',
                    slug: 'parent slug',
                    previousSlugs: ['parent prev', 'parent ious'],
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
                  __entity: 'Category',
                  id: { __entity: 'Identifier', val: 'id' },
                  name: 'name',
                  slug: 'slug',
                  previousSlugs: ['prev', 'ious'],
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
                __entity: 'Category',
                id: { __entity: 'Identifier', val: 'child id' },
                name: 'child name',
                slug: 'child slug',
                previousSlugs: ['child prev', 'child ious'],
                description: 'child description',
                shortDescription: 'child short description',
                parent: {
                  __entity: 'Category',
                  id: { __entity: 'Identifier', val: 'id' },
                  name: 'name',
                  slug: 'slug',
                  previousSlugs: ['prev', 'ious'],
                  description: 'description',
                  shortDescription: 'short description',
                  children: [],
                  updated: categoryUpdated,
                },
                children: [
                  {
                    __entity: 'Category',
                    id: { __entity: 'Identifier', val: 'grandchild id' },
                    name: 'grandchild name',
                    slug: 'grandchild slug',
                    previousSlugs: ['grandchild prev', 'grandchild ious'],
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
          const mapper = newCategoryMapper()
          expect(mapper.category(categoryDomain)).toEqual({
            id: 'id',
            name: 'name',
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            description: 'description',
            shortDescription: 'short description',
            parent: {
              id: 'parent id',
              name: 'parent name',
              slug: 'parent slug',
              previousSlugs: ['parent prev', 'parent ious'],
              description: 'parent description',
              shortDescription: 'parent short description',
              parent: {
                id: 'grandparent id',
                name: 'grandparent name',
                slug: 'grandparent slug',
                previousSlugs: ['grandparent prev', 'grandparent ious'],
                description: 'grandparent description',
                shortDescription: 'grandparent short description',
                children: [
                  {
                    id: 'parent id',
                    name: 'parent name',
                    slug: 'parent slug',
                    previousSlugs: ['parent prev', 'parent ious'],
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
                  slug: 'slug',
                  previousSlugs: ['prev', 'ious'],
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
                slug: 'child slug',
                previousSlugs: ['child prev', 'child ious'],
                description: 'child description',
                shortDescription: 'child short description',
                parent: {
                  id: 'id',
                  name: 'name',
                  slug: 'slug',
                  previousSlugs: ['prev', 'ious'],
                  description: 'description',
                  shortDescription: 'short description',
                  children: [],
                  updated: categoryUpdated,
                },
                children: [
                  {
                    id: 'grandchild id',
                    name: 'grandchild name',
                    slug: 'grandchild slug',
                    previousSlugs: ['grandchild prev', 'grandchild ious'],
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
          } as Category)
        })
      })
      describe('When there are no previous slugs', () => {
        test('Then it is mapped correctly', () => {
          const categoryUpdated = new Date()
          const idResult = newIdentifier('id')
          assertResultOk(idResult)

          const categoryResult = newCategory({
            id: idResult.value,
            name: 'name',
            slug: 'slug',
            previousSlugs: [],
            description: 'description',
            shortDescription: 'short description',
            children: [],
            updated: categoryUpdated,
          })
          assertResultOk(categoryResult)
          const categoryDomain = categoryResult.value

          const mapper = newCategoryMapper()
          expect(mapper.category(categoryDomain)).toEqual({
            id: 'id',
            name: 'name',
            slug: 'slug',
            previousSlugs: [],
            description: 'description',
            shortDescription: 'short description',
            parent: undefined,
            children: [],
            updated: categoryUpdated,
          } as Category)
        })
      })
      describe('When there are previous slugs', () => {
        test('Then it is mapped correctly', () => {
          const categoryUpdated = new Date()
          const idResult = newIdentifier('id')
          assertResultOk(idResult)

          const categoryResult = newCategory({
            id: idResult.value,
            name: 'name',
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            description: 'description',
            shortDescription: 'short description',
            children: [],
            updated: categoryUpdated,
          })
          assertResultOk(categoryResult)
          const categoryDomain = categoryResult.value

          const mapper = newCategoryMapper()
          expect(mapper.category(categoryDomain)).toEqual({
            id: 'id',
            name: 'name',
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            description: 'description',
            shortDescription: 'short description',
            parent: undefined,
            children: [],
            updated: categoryUpdated,
          } as Category)
        })
      })
    })
  })
  describe('categories', () => {
    describe('Given no categories', () => {
      test('Then it is mapped correctly', () => {
        const mapper = newCategoryMapper()
        expect(mapper.categories([])).toEqual([])
      })
    })
    describe('Given multiple categories', () => {
      test('Then they are mapped correctly', () => {
        const updated1 = new Date()
        const updated2 = new Date()
        const categoryDomains: CategoryDomain[] = [
          {
            __entity: 'Category',
            id: { __entity: 'Identifier', val: 'id 1' },
            name: 'name 1',
            slug: 'slug 1',
            previousSlugs: ['prev 1', 'ious 1'],
            description: 'description 1',
            shortDescription: 'short description 1',
            children: [],
            updated: updated1,
          },
          {
            __entity: 'Category',
            id: { __entity: 'Identifier', val: 'id 2' },
            name: 'name 2',
            slug: 'slug 2',
            previousSlugs: [],
            description: 'description 2',
            shortDescription: 'short description 2',
            children: [],
            updated: updated2,
          },
        ]
        const mapper = newCategoryMapper()
        expect(mapper.categories(categoryDomains)).toEqual([
          {
            id: 'id 1',
            name: 'name 1',
            slug: 'slug 1',
            previousSlugs: ['prev 1', 'ious 1'],
            description: 'description 1',
            shortDescription: 'short description 1',
            children: [],
            updated: updated1,
          },
          {
            id: 'id 2',
            name: 'name 2',
            slug: 'slug 2',
            previousSlugs: [],
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

describe('UpdatedMapper', () => {
  describe('updated', () => {
    let riskMapper: RiskMapper
    let categoryMapper: CategoryMapper
    let riskMapperRisk: jest.MockedFunction<RiskMapper['risk']>
    let categoryMapperCategory: jest.MockedFunction<CategoryMapper['category']>
    beforeEach(() => {
      riskMapperRisk = jest.fn()
      riskMapper = {
        risk: riskMapperRisk,
        risks: mockThrows('unexpected risks call'),
        createDetails: mockThrows('unexpected createDetails call'),
      }
      categoryMapperCategory = jest.fn()
      categoryMapper = {
        category: categoryMapperCategory,
        categories: mockThrows('unexpected categories call'),
      }
    })
    describe('Given an array of updated entities', () => {
      describe('When it contains all possible types of Updated entities', () => {
        let updated: UpdatedDomain[]
        beforeEach(() => {
          updated = [
            {
              __entity: 'Category',
              id: { __entity: 'Identifier', val: 'id' },
              name: 'name',
              slug: 'slug',
              previousSlugs: ['prev', 'ious'],
              shortDescription: 'short description',
              children: [],
              updated: new Date(),
            } as CategoryDomain,
            {
              id: { __entity: 'Identifier', val: 'id' },
              category: CategoryTopLevelDomain.Health,
              impact: ImpactDomain.High,
              likelihood: LikelihoodDomain.High,
              shortDescription: 'short description',
              name: 'name',
              type: RiskTypeDomain.Condition,
              updated: new Date(),
            } as RiskDomain,
          ]
          riskMapperRisk.mockReset()
          categoryMapperCategory.mockReset()
        })
        test('Then the Category entities are mapped correctly', () => {
          const mappedCategory: Category = {
            id: 'id',
            name: 'name',
            children: [],
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            shortDescription: 'short description',
            updated: new Date(),
          }
          categoryMapperCategory.mockReturnValueOnce(mappedCategory)

          const mapper = newUpdatedMapper(categoryMapper, riskMapper)
          const results = mapper.updated(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(2)
          expect(results.okValues[0]).toEqual(mappedCategory)

          expect(categoryMapperCategory.mock.calls).toHaveLength(1)
          expect(categoryMapperCategory.mock.calls[0]).toEqual([updated[0]])
        })
        test('Then the Risk entities are mapped using the risk mapper', () => {
          const mappedRisk: Risk = {
            id: 'id',
            category: 'Health',
            impact: 'High',
            likelihood: 'Normal',
            name: 'name',
            shortDescription: 'short description',
            type: 'Condition',
            updated: new Date(),
          }
          riskMapperRisk.mockReturnValueOnce(mappedRisk)

          const mapper = newUpdatedMapper(categoryMapper, riskMapper)
          const results = mapper.updated(updated)
          expect(results.firstErrorResult).toBeUndefined()
          expect(results.okValues).toHaveLength(2)
          expect(results.okValues[1]).toEqual(mappedRisk)

          expect(riskMapperRisk.mock.calls).toHaveLength(1)
          expect(riskMapperRisk.mock.calls[0]).toEqual([updated[1]])
        })
      })
      describe('When it contains an unhandled Updated type', () => {
        test('Then it returns an error', () => {
          const updated: UpdatedDomain[] = [
            {
              __entity: 'Category',
              id: { __entity: 'Identifier', val: 'id' },
              name: 'name',
              slug: 'slug',
              previousSlugs: ['prev', 'ious'],
              shortDescription: 'short description',
              children: [],
              updated: new Date(),
            } as CategoryDomain,
            {
              other: 'object',
            } as unknown as UpdatedDomain,
          ]

          const mapper = newUpdatedMapper(categoryMapper, riskMapper)
          const results = mapper.updated(updated)
          expect(results.firstErrorResult).toBeDefined()
          expect(results.firstErrorResult?.message).toBe('Unhandled Updated type')
        })
      })
    })
    describe('Given an empty array', () => {
      test('Then it returns an empty results', () => {
        const mapper = newUpdatedMapper(categoryMapper, riskMapper)
        const results = mapper.updated([])
        expect(results.firstErrorResult).toBeUndefined()
        expect(results.okValues).toHaveLength(0)

        expect(categoryMapperCategory.mock.calls).toHaveLength(0)
        expect(riskMapperRisk.mock.calls).toHaveLength(0)
      })
    })
  })
})

describe('isUpdatedCategory', () => {
  describe('Given a Category', () => {
    describe('When it contains no optional properties', () => {
      test('Then it returns true', () => {
        const category: Category = {
          id: 'id',
          name: 'name',
          slug: 'slug',
          previousSlugs: [],
          children: [],
          shortDescription: 'short description',
          updated: new Date(),
        }
        expect(isUpdatedCategory(category)).toBe(true)
      })
    })
    describe('When it contains all optional properties', () => {
      test('Then it returns true', () => {
        const category: Category = {
          id: 'id',
          name: 'name',
          slug: 'slug',
          previousSlugs: ['prev', 'ious'],
          children: [
            {
              id: 'id',
              name: 'name',
              slug: 'slug',
              previousSlugs: ['prev', 'ious'],
              children: [],
              shortDescription: 'short description',
              updated: new Date(),
            },
          ],
          shortDescription: 'short description',
          updated: new Date(),
          description: 'description',
          parent: {
            id: 'id',
            name: 'name',
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            children: [],
            shortDescription: 'short description',
            updated: new Date(),
          },
        }
        expect(isUpdatedCategory(category)).toBe(true)
      })
    })
  })
  describe('Given a Risk', () => {
    describe('When it has all optional properties', () => {
      test('Then it returns false', () => {
        const risk: Risk = {
          id: 'id',
          category: 'Health',
          impact: 'High',
          likelihood: 'Normal',
          name: 'name',
          shortDescription: 'short description',
          type: 'Condition',
          updated: new Date(),
          notes: 'notes',
          parent: {
            id: 'id',
            category: 'Health',
            impact: 'High',
            likelihood: 'Normal',
            name: 'name',
            shortDescription: 'short description',
            type: 'Condition',
            updated: new Date(),
            notes: 'notes',
          },
        }
        expect(isUpdatedCategory(risk)).toBe(false)
      })
    })
  })
})

describe('isUpdatedRisk', () => {
  describe('Given a Risk', () => {
    describe('When it contains no optional properties', () => {
      test('Then it returns true', () => {
        const risk: Risk = {
          id: 'id',
          category: 'Health',
          impact: 'High',
          likelihood: 'Normal',
          name: 'name',
          shortDescription: 'short description',
          type: 'Condition',
          updated: new Date(),
        }
        expect(isUpdatedRisk(risk)).toBe(true)
      })
    })
    describe('When it contains all optional properties', () => {
      test('Then it returns true', () => {
        const risk: Risk = {
          id: 'id',
          category: 'Health',
          impact: 'High',
          likelihood: 'Normal',
          name: 'name',
          shortDescription: 'short description',
          type: 'Condition',
          updated: new Date(),
          notes: 'notes',
          parent: {
            id: 'id',
            category: 'Health',
            impact: 'High',
            likelihood: 'Normal',
            name: 'name',
            shortDescription: 'short description',
            type: 'Condition',
            updated: new Date(),
            notes: 'notes',
          },
        }
        expect(isUpdatedRisk(risk)).toBe(true)
      })
    })
  })
  describe('Given a Category', () => {
    describe('When it has all optional properties', () => {
      test('Then it returns false', () => {
        const category: Category = {
          id: 'id',
          name: 'name',
          slug: 'slug',
          previousSlugs: ['prev', 'ious'],
          children: [
            {
              id: 'id',
              name: 'name',
              slug: 'slug',
              previousSlugs: ['prev', 'ious'],
              children: [],
              shortDescription: 'short description',
              updated: new Date(),
            },
          ],
          shortDescription: 'short description',
          updated: new Date(),
          description: 'description',
          parent: {
            id: 'id',
            name: 'name',
            slug: 'slug',
            previousSlugs: ['prev', 'ious'],
            children: [],
            shortDescription: 'short description',
            updated: new Date(),
          },
        }
        expect(isUpdatedRisk(category)).toBe(false)
      })
    })
  })
})
