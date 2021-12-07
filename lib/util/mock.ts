import { MockProxy, DeepMockProxy, mock as mockLib, mockDeep as mockDeepLib } from 'jest-mock-extended'

type Mocked<T> = MockProxy<T>

type MockedDeep<T> = DeepMockProxy<T>

// Get the return type of jest-mock-extended functions.
// Those functions are generic, so can't be extracted with the ReturnType
// utility type. This is a workaround.
class Dummy<T> {
  public mock = mockLib<T>()
  public mockDeep = mockDeepLib<T>()
}
type MockReturn<T> = Dummy<T>['mock']
type MockDeepReturn<T> = Dummy<T>['mockDeep']

function mock<T>(): MockReturn<T> {
  return mockLib<T>()
}

function mockDeep<T>(): MockDeepReturn<T> {
  return mockDeepLib<T>()
}

export type { Mocked, MockedDeep }
export { mock, mockDeep }
