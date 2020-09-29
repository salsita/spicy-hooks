import { noop, Observable } from 'rxjs'

import { shareReplayReset } from './share-replay-reset'

describe('shareReset', () => {
  it('multicasts', () => {
    const subscribe = jest.fn(subscriber => subscriber.next(1))
    const source = new Observable(subscribe)
    const shared = source.pipe(shareReplayReset())

    const next1 = jest.fn()
    shared.subscribe({ next: next1 })
    const next2 = jest.fn()
    shared.subscribe({ next: next2 })

    expect(subscribe).toHaveBeenCalledTimes(1)
    expect(next1).toHaveBeenCalledWith(1)
    expect(next2).toHaveBeenCalledWith(1)
  })

  it('unsubscribes automatically', () => {
    const unsubscribe = jest.fn()
    const source = new Observable(() => unsubscribe)
    const shared = source.pipe(shareReplayReset())

    const subscriptions = [
      shared.subscribe({ next: noop }),
      shared.subscribe({ next: noop })
    ]
    expect(unsubscribe).not.toHaveBeenCalled()
    subscriptions.forEach(subscription => subscription.unsubscribe())
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('does not replay after reset', () => {
    let counter = 0
    const source = new Observable(subscriber => {
      subscriber.next(++counter)
    })
    const shared = source.pipe(shareReplayReset())

    const next1 = jest.fn()
    const subscription1 = shared.subscribe({ next: next1 })
    expect(next1).toHaveBeenCalledWith(1)

    subscription1.unsubscribe()

    const next2 = jest.fn()
    shared.subscribe({ next: next2 })
    expect(next2).toHaveBeenCalledWith(2)
    expect(next2).toHaveBeenCalledTimes(1)
  })
})
