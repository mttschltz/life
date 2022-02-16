import { mock, Mocked } from '@helper/mock'
import { FetchChildrenMapper, FetchChildrenRepo, newFetchChildrenInteractor } from './fetchChildren'
import { Category } from '@life/usecase/mapper'
import { Category as CategoryDomain } from '@life/category'
import { Results, resultsError, resultsOk } from '@helper/result'

describe('fetchChildren', () => {
  describe('Given a category id that has children', () => {
    let fetchedChildren: CategoryDomain[]
    let repo: Mocked<FetchChildrenRepo>
    let mappedChildren: Category[]
    let mapper: Mocked<FetchChildrenMapper>
    beforeEach(() => {
      fetchedChildren = [
        {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'fetched child1 id' },
          name: 'fetched child1 id',
          path: 'fetched child1 path',
          shortDescription: 'fetched child1 short description',
          children: [],
          updated: new Date(),
        },
        {
          __entity: 'Category',
          id: { __entity: 'Identifier', val: 'fetched child2 id' },
          name: 'fetched child2 id',
          path: 'fetched child2 path',
          shortDescription: 'fetched child2 short description',
          children: [],
          updated: new Date(),
        },
      ]
      repo = mock<FetchChildrenRepo>()
      repo.fetchChildren.mockReturnValueOnce(Promise.resolve(resultsOk(fetchedChildren)))
      mappedChildren = [
        {
          id: 'mapped child1 id',
          name: 'mapped child1 id',
          path: 'mapped child1 path',
          shortDescription: 'mapped child1 short description',
          children: [],
          updated: new Date(),
        },
        {
          id: 'mapped child2 id',
          name: 'mapped child2 id',
          path: 'mapped child2 path',
          shortDescription: 'mapped child2 short description',
          children: [],
          updated: new Date(),
        },
      ]
      mapper = mock<FetchChildrenMapper>()
      mapper.categories.mockReturnValueOnce(mappedChildren)
    })
    describe('When everything succeeds', () => {
      test('Then the child categories are returned', async () => {
        const interactor = newFetchChildrenInteractor(repo, mapper)
        const childrenResults = await interactor.fetchChildren('category id')
        expect(childrenResults.firstErrorResult).toBeUndefined()
        expect(childrenResults.okValues).toEqual(mappedChildren)
      })
      test('Then the repo is called', async () => {
        const interactor = newFetchChildrenInteractor(repo, mapper)
        await interactor.fetchChildren('category id')
        expect(repo.fetchChildren.mock.calls).toHaveLength(1)
        expect(repo.fetchChildren.mock.calls[0]).toEqual(['category id'])
      })
      test('Then the mapper is called', async () => {
        const interactor = newFetchChildrenInteractor(repo, mapper)
        await interactor.fetchChildren('category id')
        expect(mapper.categories.mock.calls).toHaveLength(1)
        expect(mapper.categories.mock.calls[0]).toEqual([fetchedChildren])
      })
    })
    describe('When calling the repo errors', () => {
      let err: Results<CategoryDomain>
      beforeEach(() => {
        err = resultsError('fetching errror')
        repo.fetchChildren.mockReset()
        repo.fetchChildren.mockReturnValueOnce(Promise.resolve(err))
      })
      test('Then the error result is returned', async () => {
        const interactor = newFetchChildrenInteractor(repo, mapper)
        const childrenResults = await interactor.fetchChildren('category id')
        expect(childrenResults.firstErrorResult).toEqual(err)
      })
    })
  })
  describe('Given a category id that has no children', () => {
    let repo: Mocked<FetchChildrenRepo>
    let mapper: Mocked<FetchChildrenMapper>
    beforeEach(() => {
      repo = mock<FetchChildrenRepo>()
      repo.fetchChildren.mockReturnValueOnce(Promise.resolve(resultsOk([])))
      mapper = mock<FetchChildrenMapper>()
      mapper.categories.mockReturnValueOnce([])
    })
    describe('When everything succeeds', () => {
      test('Then the child categories are returned', async () => {
        const interactor = newFetchChildrenInteractor(repo, mapper)
        const childrenResults = await interactor.fetchChildren('category id')
        expect(childrenResults.firstErrorResult).toBeUndefined()
        expect(childrenResults.okValues).toEqual([])
      })
      test('Then the repo is called', async () => {
        const interactor = newFetchChildrenInteractor(repo, mapper)
        await interactor.fetchChildren('category id')
        expect(repo.fetchChildren.mock.calls).toHaveLength(1)
        expect(repo.fetchChildren.mock.calls[0]).toEqual(['category id'])
      })
      test('Then the mapper is called', async () => {
        const interactor = newFetchChildrenInteractor(repo, mapper)
        await interactor.fetchChildren('category id')
        expect(mapper.categories.mock.calls).toHaveLength(1)
        expect(mapper.categories.mock.calls[0]).toEqual([[]])
      })
    })
  })
})
