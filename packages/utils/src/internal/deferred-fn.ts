import { Subject } from 'rxjs'
import { take } from 'rxjs/operators'

/**
 * An extension to `jest.Mock<T,Y>` that allows waiting for asynchronous calls.
 *
 * @stable
 */
export interface DeferredMock<T = any, Y extends any[] = any> extends jest.Mock<T, Y> {
  /**
   * Wait for next call to the mocked function.
   *
   * @param timeout maximum amount of milliseconds to wait for the call before throwing a time-out exception (default is ˙300˙)
   * @returns promise of this mock function
   */
  afterNextCall (timeout?: number): Promise<DeferredMock<T, Y>>
  /**
   * Wait for Nth call to the mocked function from the moment this function is called.
   *
   * @param callCount number of calls to wait for
   * @param timeout maximum amount of milliseconds to wait for the Nth call before throwing a time-out exception (default is ˙300˙)
   * @returns promise of this mock function
   */
  afterNthCall (callCount: number, timeout?: number): Promise<DeferredMock<T, Y>>
}

export function deferredFn (): DeferredMock
export function deferredFn<T, Y extends any[]> (implementation?: (...args: Y) => T): DeferredMock<T, Y>

/**
 * An extension to `jest.fn()` that allows waiting for asynchronous calls.
 *
 * @param implementation mocked implementation of the function
 * @returns enhanced mock object with [[DeferredMock.afterNextCall]] and [[DeferredMock.afterNthCall]] methods
 * @typeparam T return type of the mock implementation
 * @typeparam Y argument types of the mock implementation
 * @stable
 */
export function deferredFn<T, Y extends any[]> (implementation?: (...args: Y) => T): DeferredMock<T, Y> {
  const callSubject = new Subject<T>()
  const mockFn = jest.fn((...args: Y) => {
    const result = implementation?.(...args)
    callSubject.next(result)
    return result
  }) as DeferredMock<T, Y>

  mockFn.afterNthCall = async (callCount: number, timeout = 300) => {
    const callPromise = callSubject.pipe(take(callCount)).toPromise()
    const timeoutPromise = new Promise((resolve, reject) =>
      setTimeout(
        () => reject(new Error(`'afterNthCall' timed out after ${timeout} ms`)),
        timeout
      )
    )
    await Promise.race([
      callPromise,
      timeoutPromise
    ])
    return mockFn
  }

  mockFn.afterNextCall = (timeout = 300) => mockFn.afterNthCall(1, timeout)

  return mockFn
}
