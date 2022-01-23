import { Category as CategoryDomain } from '@life/category'
import { mockDeep, Mocked } from '@helper/mock'
import { Result, resultError, resultOk } from '@helper/result'
import { assertResultError, assertResultOk } from '@helper/testing'
import { FetchParentMapper, FetchParentRepo, newFetchParentInteractor } from './fetchParent'
import { Category } from '@life/usecase/mapper'

describe('fetchParent', () => {
  let repo: Mocked<FetchParentRepo>
  let mapper: Mocked<FetchParentMapper>
  beforeEach(() => {
    repo = mockDeep()
    mapper = mockDeep()
  })
  describe('Given the id for a child that has a parent', () => {
    let fetchedParent: CategoryDomain
    let mappedParent: Category
    beforeEach(() => {
      fetchedParent = {
        id: 'fetched id',
        name: 'fetched name',
        path: 'fetched path',
        shortDescription: 'fetched short description',
        children: [],
        updated: new Date(),
      }
      repo.fetchParent.mockReturnValueOnce(Promise.resolve(resultOk<CategoryDomain | undefined>(fetchedParent)))
      mappedParent = {
        id: 'mapped id',
        name: 'mapped name',
        path: 'mapped path',
        shortDescription: 'mapped short description',
        children: [],
        updated: new Date(),
      }
      mapper.category.mockReturnValueOnce(mappedParent)
    })
    describe('When everything succeeds', () => {
      test('Then the mapped parent is returned', async () => {
        const interactor = newFetchParentInteractor(repo, mapper)
        const parentResult = await interactor.fetchParent('child id')
        assertResultOk(parentResult)
        expect(parentResult.value).toBe(mappedParent)
      })
      test('Then the repo is called', async () => {
        const interactor = newFetchParentInteractor(repo, mapper)
        const parentResult = await interactor.fetchParent('child id')
        assertResultOk(parentResult)
        expect(repo.fetchParent.mock.calls).toHaveLength(1)
        expect(repo.fetchParent.mock.calls[0]).toEqual(['child id'])
      })
      test('Then the mapper is called', async () => {
        const interactor = newFetchParentInteractor(repo, mapper)
        const parentResult = await interactor.fetchParent('child id')
        assertResultOk(parentResult)
        expect(mapper.category.mock.calls).toHaveLength(1)
        expect(mapper.category.mock.calls[0]).toEqual([fetchedParent])
      })
    })
    describe('When fetching the parent errors', () => {
      let err: Result<CategoryDomain>
      beforeEach(() => {
        repo.fetchParent.mockReset()
        err = resultError<CategoryDomain>('fetching error')
        repo.fetchParent.mockReturnValueOnce(Promise.resolve(err))
      })
      test('Then the error result is returned', async () => {
        const interactor = newFetchParentInteractor(repo, mapper)
        const parentResult = await interactor.fetchParent('child id')
        assertResultError(parentResult)
        expect(parentResult).toBe(err)
      })
    })
  })
  describe('Given the id for a child that has no parent', () => {
    beforeEach(() => {
      repo.fetchParent.mockReturnValueOnce(Promise.resolve(resultOk<CategoryDomain | undefined>(undefined)))
    })
    describe('When everything succeeds', () => {
      test('Then it returns undefined', async () => {
        const interactor = newFetchParentInteractor(repo, mapper)
        const parentResult = await interactor.fetchParent('child id')
        assertResultOk(parentResult)
        expect(parentResult.value).toBeUndefined()
      })
      test('Then the repo is called', async () => {
        const interactor = newFetchParentInteractor(repo, mapper)
        const parentResult = await interactor.fetchParent('child id')
        assertResultOk(parentResult)
        expect(repo.fetchParent.mock.calls).toHaveLength(1)
        expect(repo.fetchParent.mock.calls[0]).toEqual(['child id'])
      })
      test('Then the mapper is not called', async () => {
        const interactor = newFetchParentInteractor(repo, mapper)
        const parentResult = await interactor.fetchParent('child id')
        assertResultOk(parentResult)
        expect(mapper.category.mock.calls).toHaveLength(0)
      })
    })
  })
})
