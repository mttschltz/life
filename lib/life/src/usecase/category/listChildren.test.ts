import { mock, Mocked } from '@helper/mock'
import { ListChildrenMapper, ListChildrenRepo, newListChildrenInteractor } from './listChildren'
import { Category } from '@life/usecase/mapper'
import { Category as CategoryDomain } from '@life/category'
import { Results, resultsError, resultsOk } from '@helper/result'

describe('listChildren', () => {
  describe('Given a category id that has children', () => {
    let listedChildren: CategoryDomain[]
    let repo: Mocked<ListChildrenRepo>
    let mappedChildren: Category[]
    let mapper: Mocked<ListChildrenMapper>
    beforeEach(() => {
      listedChildren = [
        {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'listed child1 id' },
          name: 'listed child1 id',
          slug: 'listed child1 slug',
          previousSlugs: ['listed child1 prev', 'listed child1 ious'],
          shortDescription: 'listed child1 short description',
          children: [],
          updated: new Date(),
        },
        {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'listed child2 id' },
          name: 'listed child2 id',
          slug: 'listed child2 slug',
          previousSlugs: ['listed child2 prev', 'listed child2 ious'],
          shortDescription: 'listed child2 short description',
          children: [],
          updated: new Date(),
        },
      ]
      repo = mock<ListChildrenRepo>()
      repo.listChildren.mockReturnValueOnce(Promise.resolve(resultsOk(listedChildren)))
      mappedChildren = [
        {
          id: 'mapped child1 id',
          name: 'mapped child1 id',
          slug: 'mapped child1 slug',
          previousSlugs: [],
          shortDescription: 'mapped child1 short description',
          children: [],
          updated: new Date(),
        },
        {
          id: 'mapped child2 id',
          name: 'mapped child2 id',
          slug: 'mapped child2 slug',
          previousSlugs: [],
          shortDescription: 'mapped child2 short description',
          children: [],
          updated: new Date(),
        },
      ]
      mapper = mock<ListChildrenMapper>()
      mapper.categories.mockReturnValueOnce(mappedChildren)
    })
    describe('When everything succeeds', () => {
      test('Then the child categories are returned', async () => {
        const interactor = newListChildrenInteractor(repo, mapper)
        const childrenResults = await interactor.listChildren('category id')
        expect(childrenResults.firstErrorResult).toBeUndefined()
        expect(childrenResults.okValues).toEqual(mappedChildren)
      })
      test('Then the repo is called', async () => {
        const interactor = newListChildrenInteractor(repo, mapper)
        await interactor.listChildren('category id')
        expect(repo.listChildren.mock.calls).toHaveLength(1)
        expect(repo.listChildren.mock.calls[0]).toEqual(['category id'])
      })
      test('Then the mapper is called', async () => {
        const interactor = newListChildrenInteractor(repo, mapper)
        await interactor.listChildren('category id')
        expect(mapper.categories.mock.calls).toHaveLength(1)
        expect(mapper.categories.mock.calls[0]).toEqual([listedChildren])
      })
    })
    describe('When calling the repo errors', () => {
      let err: Results<CategoryDomain>
      beforeEach(() => {
        err = resultsError('listing error')
        repo.listChildren.mockReset()
        repo.listChildren.mockReturnValueOnce(Promise.resolve(err))
      })
      test('Then the error result is returned', async () => {
        const interactor = newListChildrenInteractor(repo, mapper)
        const childrenResults = await interactor.listChildren('category id')
        expect(childrenResults.firstErrorResult).toEqual(err)
      })
    })
  })
  describe('Given a category id that has no children', () => {
    let repo: Mocked<ListChildrenRepo>
    let mapper: Mocked<ListChildrenMapper>
    beforeEach(() => {
      repo = mock<ListChildrenRepo>()
      repo.listChildren.mockReturnValueOnce(Promise.resolve(resultsOk([])))
      mapper = mock<ListChildrenMapper>()
      mapper.categories.mockReturnValueOnce([])
    })
    describe('When everything succeeds', () => {
      test('Then the child categories are returned', async () => {
        const interactor = newListChildrenInteractor(repo, mapper)
        const childrenResults = await interactor.listChildren('category id')
        expect(childrenResults.firstErrorResult).toBeUndefined()
        expect(childrenResults.okValues).toEqual([])
      })
      test('Then the repo is called', async () => {
        const interactor = newListChildrenInteractor(repo, mapper)
        await interactor.listChildren('category id')
        expect(repo.listChildren.mock.calls).toHaveLength(1)
        expect(repo.listChildren.mock.calls[0]).toEqual(['category id'])
      })
      test('Then the mapper is called', async () => {
        const interactor = newListChildrenInteractor(repo, mapper)
        await interactor.listChildren('category id')
        expect(mapper.categories.mock.calls).toHaveLength(1)
        expect(mapper.categories.mock.calls[0]).toEqual([[]])
      })
    })
  })
})
