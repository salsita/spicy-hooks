import { Observable, Subscriber, TeardownLogic } from 'rxjs'

import { Store, StoreLike } from './store'
import { DerivedStore } from './derived-store'
import { getSynchronousEmit } from '../utils'

interface ComplexState {
  propA: number
  propB: number
}

const mockComplexState: ComplexState = {
  propA: 1,
  propB: 10
}

class MockStoreLike<T> extends Observable<T> implements StoreLike<T> {
  constructor (
    subscribe: (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic,
    private readonly updateCallback: (updater: (prev: T) => T) => T
  ) {
    super(subscribe)
  }

  update (updater: (prev: T) => T): T {
    return this.updateCallback(updater)
  }

  next (value: T): void {
    this.update(() => value)
  }
}

describe('DerivedStore', () => {
  it('derives state', () => {
    const store = new Store(mockComplexState)
    const derivedStore = new DerivedStore(
      store,
      complexState => complexState.propA,
      (complexState, propA) => ({ ...complexState, propA })
    )

    const value = getSynchronousEmit(derivedStore)
    expect(value).toBe(1)
  })

  it('updates source state (using update)', () => {
    const store = new Store(mockComplexState)
    const derivedStore = new DerivedStore(
      store,
      complexState => complexState.propA,
      (complexState, propA) => ({ ...complexState, propA })
    )

    derivedStore.update(val => val + 1)

    const value = getSynchronousEmit(store)
    expect(value).toEqual({ propA: 2, propB: 10 })
  })

  it('updates source state (using next)', () => {
    const store = new Store(mockComplexState)
    const derivedStore = new DerivedStore(
      store,
      complexState => complexState.propA,
      (complexState, propA) => ({ ...complexState, propA })
    )

    derivedStore.next(3)

    const value = getSynchronousEmit(store)
    expect(value).toEqual({ propA: 3, propB: 10 })
  })

  it('manages subscriptions to the source store', () => {
    let subscriptionCount = 0
    const store = new MockStoreLike<ComplexState>(
      subscriber => {
        subscriptionCount++
        subscriber.next(mockComplexState)
        return () => subscriptionCount--
      },
      updater => updater(mockComplexState)
    )

    const derivedStore = new DerivedStore(
      store,
      complexState => complexState.propA,
      (complexState, propA) => ({ ...complexState, propA })
    )

    const subscription1 = derivedStore.subscribe({ next: () => {} })
    expect(subscriptionCount).toBe(1)
    const subscription2 = derivedStore.subscribe({ next: () => {} })
    expect(subscriptionCount).toBe(1)

    subscription1.unsubscribe()
    expect(subscriptionCount).toBe(1)
    subscription2.unsubscribe()
    expect(subscriptionCount).toBe(0)
  })
})
