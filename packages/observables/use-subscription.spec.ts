import { Observable, Subject } from 'rxjs'
import { renderHook } from '@testing-library/react-hooks'

import { useSubscription } from './use-subscription'

describe('useSubscription', () => {
  it('receives emits', () => {
    const next = jest.fn()

    const subject = new Subject()

    renderHook(() => useSubscription(subject, { next }, []))
    expect(next).not.toHaveBeenCalled()

    subject.next(1)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(1)

    subject.next(2)
    expect(next).toHaveBeenCalledTimes(2)
    expect(next).toHaveBeenCalledWith(2)
  })

  it('unsubscribes on unmount', () => {
    const unsubscribe = jest.fn()
    const subscribe = jest.fn(() => unsubscribe)

    const observable = new Observable(subscribe)

    const { unmount } = renderHook(() => useSubscription(observable, { next: () => {} }, []))
    expect(subscribe).toHaveBeenCalledTimes(1)
    expect(unsubscribe).not.toHaveBeenCalled()

    unmount()
    expect(subscribe).toHaveBeenCalledTimes(1)
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('re-subscribes when deps change', () => {
    const log: string[] = []

    let counter = 0
    const observable = new Observable(() => {
      const subscriptionCount = ++counter
      log.push(`SUBSCRIBE ${subscriptionCount}`)
      return () => {
        log.push(`UNSUBSCRIBE ${subscriptionCount}`)
      }
    })

    const props = {
      dependency: 1
    }

    const { rerender } = renderHook(() => useSubscription(observable, { next: () => {} }, [props.dependency]))
    expect(log).toEqual(['SUBSCRIBE 1'])

    rerender()
    expect(log).toEqual(['SUBSCRIBE 1'])

    props.dependency = 2
    rerender()
    expect(log).toEqual(['SUBSCRIBE 1', 'UNSUBSCRIBE 1', 'SUBSCRIBE 2'])
  })
})
