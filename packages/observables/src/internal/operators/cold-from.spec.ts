import { Observable, of, Subject } from 'rxjs'
import { latency } from '@spicy-hooks/utils'

import { coldFrom } from './cold-from'
import { getSynchronousEmit } from '../utils'
import { deferredFn } from '../testing/deferred-fn'

describe('coldFrom', () => {
  it('defers execution until subscribed to', () => {
    const action = jest.fn(() => [1, 2, 3])
    let emission: Observable<number> | null = null
    const subject = new Subject<() => number[]>()
    const result$ = subject.pipe(coldFrom())

    result$.subscribe({
      next: value => {
        emission = value
      }
    })

    subject.next(action)

    expect(emission).not.toBeNull()
    expect(typeof emission!.subscribe).toBe('function')
    expect(action).not.toHaveBeenCalled()

    const next = jest.fn<void, [number]>()

    emission!.subscribe({ next })
    expect(action).toHaveBeenCalledTimes(1)
    expect(next.mock.calls).toEqual([[1], [2], [3]])
  })

  it('defers async functions', async () => {
    const action = jest.fn(async () => {
      await latency(5)
      return 1
    })

    const source = of(action)
    const emission = getSynchronousEmit(source.pipe(coldFrom()))

    const num = await emission.toPromise()
    expect(num).toBe(1)
  })

  it('unsubscribes from the source when unsubscribed from', async () => {
    const unsubscribe = jest.fn()
    const action = () => new Observable<number>(subscriber => {
      let counter = 0
      const interval = setInterval(() => subscriber.next(++counter), 10)
      return () => {
        clearInterval(interval)
        unsubscribe()
      }
    })
    const num$ = getSynchronousEmit(of(action).pipe(coldFrom()))

    const next = deferredFn()

    const subscription = num$.subscribe({ next })
    await expect(next.afterNthCall(3)).resolves.toHaveBeenCalledWith(3)
    expect(unsubscribe).not.toHaveBeenCalled()

    subscription.unsubscribe()
    expect(unsubscribe).toHaveBeenCalled()
  })
})
