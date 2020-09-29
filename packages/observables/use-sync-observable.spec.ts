import { renderHook } from '@testing-library/react-hooks'
import { BehaviorSubject, Observable, Subject } from 'rxjs'

import { useSyncObservable } from './use-sync-observable'
import { latency } from '../../common'

describe('useSyncObservable', () => {
  it('passes through an existing behavior subject', () => {
    const originalSubject = new BehaviorSubject(1)

    const { result } = renderHook(() => useSyncObservable(originalSubject))
    expect(result.current).toBe(originalSubject)
  })

  it('passes through nullish', () => {
    const props: { observable: Observable<any> | null | undefined } = {
      observable: undefined
    }

    const { result, rerender } = renderHook(() => useSyncObservable(props.observable))
    expect(result.current).toBe(null) // undefined is for simplicity normalized to null

    props.observable = null
    rerender()
    expect(result.current).toBe(null)

    props.observable = new Subject()
    rerender()
    expect(result.current).toBeTruthy()
  })

  it('nexts out a sync observable', () => {
    const syncObservable = new Observable(subscriber => {
      subscriber.next(1)
    })

    const { result } = renderHook(() => useSyncObservable(syncObservable))
    expect(result.current.getValue()).toBe(1)
  })

  it('receives async emit', async () => {
    const asyncObservable = new Observable(subscriber => {
      (async () => {
        await latency(10)
        subscriber.next(1)
      })()
    })

    const { result } = renderHook(() => useSyncObservable(asyncObservable))
    expect(result.current.getValue()).toBe(null)

    await latency(20)

    expect(result.current.getValue()).toBe(1)
  })

  it('receives consecutive emits', () => {
    const next = jest.fn()

    const sourceSubject = new Subject<number>()

    const { result } = renderHook(() => useSyncObservable(sourceSubject))

    expect(result.current.getValue()).toBe(null)

    result.current.subscribe({
      next
    })

    expect(result.current.getValue()).toBe(null)
    expect(next).toBeCalledWith(null)

    sourceSubject.next(1)
    expect(result.current.getValue()).toBe(1)
    expect(next).toBeCalledWith(1)

    sourceSubject.next(2)
    expect(result.current.getValue()).toBe(2)
    expect(next).toBeCalledWith(2)
  })

  it('completes when the source completes', () => {
    const complete = jest.fn()

    const sourceSubject = new Subject<number>()

    const { result } = renderHook(() => useSyncObservable(sourceSubject))

    result.current.subscribe({
      complete
    })
    expect(complete).not.toHaveBeenCalled()

    sourceSubject.complete()
    expect(complete).toHaveBeenCalled()
  })

  it('fails when the source fails', () => {
    const error = jest.fn()

    const sourceSubject = new Subject<any>()

    const { result } = renderHook(() => useSyncObservable(sourceSubject))

    result.current.subscribe({
      error
    })
    expect(error).not.toBeCalled()

    sourceSubject.error('failed')
    expect(error).toBeCalledWith('failed')
  })

  it('returns the same subject', async () => {
    const observable = new Observable(subscriber => {
      subscriber.next(1)
    })

    const { result, rerender } = renderHook(() => useSyncObservable(observable))
    const firstSubject = result.current

    rerender()
    expect(result.current).toBe(firstSubject)
  })

  it('releases the source observable', () => {
    const unsubscribe = jest.fn()
    const subscribe = jest.fn(() => unsubscribe)

    const observable = new Observable(subscribe)

    const { unmount } = renderHook(() => useSyncObservable(observable))
    expect(subscribe).toBeCalledTimes(1)
    expect(unsubscribe).not.toBeCalled()

    unmount()
    expect(subscribe).toBeCalledTimes(1)
    expect(unsubscribe).toBeCalledTimes(1)
  })

  it('handles replacement of the source observable', () => {
    const log: string[] = []

    const observable1 = new Observable(() => {
      log.push('1 subscribed')
      return () => {
        log.push('1 unsubscribed')
      }
    })

    const observable2 = new Observable(() => {
      log.push('2 subscribed')
      return () => {
        log.push('2 unsubscribed')
      }
    })

    const props = {
      observable: observable1
    }

    const { unmount, rerender } = renderHook(() => useSyncObservable(props.observable))
    expect(log).toEqual(['1 subscribed'])

    props.observable = observable2
    rerender()
    expect(log).toEqual(['1 subscribed', '1 unsubscribed', '2 subscribed'])

    unmount()
    expect(log).toEqual(['1 subscribed', '1 unsubscribed', '2 subscribed', '2 unsubscribed'])
  })
})
