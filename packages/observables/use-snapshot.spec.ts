import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { act, renderHook } from '@testing-library/react-hooks'

import { SnapshotState, useSnapshot } from './use-snapshot'
import { latency } from '../../common'

describe('useSnapshot', () => {
  it('handles nullish observable', () => {
    const props: { observable: null | undefined | Observable<number> } = {
      observable: undefined
    }

    const { result, rerender } = renderHook(() => useSnapshot(props.observable))
    expect(result.current).toEqual([null, null, null])

    props.observable = null
    rerender()
    expect(result.current).toEqual([null, null, null])

    props.observable = new BehaviorSubject(1)
    rerender()
    expect(result.current).toEqual([1, SnapshotState.EMITTING, null])
  })

  it('takes immediate snapshot of behavior subject', () => {
    const behaviorSubject = new BehaviorSubject(1)

    const { result } = renderHook(() => useSnapshot(behaviorSubject))

    expect(result.current).toEqual([1, SnapshotState.EMITTING, null])
  })

  it('does not render unnecessarily', () => {
    const behaviorSubject = new BehaviorSubject(1)
    const render = jest.fn()
    renderHook(() => {
      render()
      return useSnapshot(behaviorSubject)
    })

    expect(render).toHaveBeenCalledTimes(1)
  })

  it('takes immediate snapshot of sync observable', () => {
    const syncObservable = new Observable(subscriber => {
      subscriber.next(1)
    })

    const { result } = renderHook(() => useSnapshot(syncObservable))

    expect(result.current).toEqual([1, SnapshotState.EMITTING, null])
  })

  it('takes delayed snapshot of async observable', async () => {
    const asyncObservable = new Observable(subscriber => {
      (async () => {
        await latency(10)
        subscriber.next(1)
      })()
    })

    const { result, waitForNextUpdate } = renderHook(() => useSnapshot(asyncObservable))

    expect(result.current).toEqual([null, SnapshotState.WAITING, null])

    await waitForNextUpdate()

    expect(result.current).toEqual([1, SnapshotState.EMITTING, null])
  })

  it('updates snapshot with subsequent emits', async () => {
    const subject = new Subject()

    const { result } = renderHook(() => useSnapshot(subject))

    expect(result.current).toEqual([null, SnapshotState.WAITING, null])

    act(() => {
      subject.next(1)
    })
    expect(result.current).toEqual([1, SnapshotState.EMITTING, null])

    act(() => {
      subject.next(2)
    })
    expect(result.current).toEqual([2, SnapshotState.EMITTING, null])
  })

  it('reports completion', async () => {
    const subject = new BehaviorSubject(1)

    const { result } = renderHook(() => useSnapshot(subject))

    act(() => {
      subject.complete()
    })
    expect(result.current).toEqual([1, SnapshotState.COMPLETED, null])
  })

  it('reports failure', async () => {
    const subject = new BehaviorSubject(1)

    const { result } = renderHook(() => useSnapshot(subject))

    act(() => {
      subject.error('failed')
    })
    expect(result.current).toEqual([1, SnapshotState.FAILED, 'failed'])
  })

  it('reports a failure preceding subscription', async () => {
    const subject = new BehaviorSubject(1)
    subject.error('failed')

    const { result } = renderHook(() => useSnapshot(subject))
    expect(result.current).toEqual([null, SnapshotState.FAILED, 'failed'])
  })

  it('releases the source observable when unmounted', () => {
    const unsubscribe = jest.fn()
    const subscribe = jest.fn(() => unsubscribe)

    const observable = new Observable(subscribe)

    const { result, unmount } = renderHook(() => useSnapshot(observable))
    expect(result.current).toEqual([null, SnapshotState.WAITING, null])
    expect(subscribe).toBeCalledTimes(1)
    expect(unsubscribe).not.toBeCalled()

    unmount()
    expect(subscribe).toBeCalledTimes(1)
    expect(unsubscribe).toBeCalledTimes(1)
  })

  it('releases the source observable when nullified', () => {
    const unsubscribe = jest.fn()
    const subscribe = jest.fn(() => unsubscribe)

    const observable = new Observable(subscribe)

    const props: { observable: null | Observable<any> } = {
      observable
    }

    const { result, rerender } = renderHook(() => useSnapshot(props.observable))
    expect(result.current).toEqual([null, SnapshotState.WAITING, null])
    expect(subscribe).toBeCalledTimes(1)
    expect(unsubscribe).not.toBeCalled()

    props.observable = null
    rerender()
    expect(subscribe).toBeCalledTimes(1)
    expect(unsubscribe).toBeCalledTimes(1)
  })

  it('resets when observable changes', async () => {
    const log: string[] = []

    const observable1 = new Observable<number>(subscriber => {
      log.push('1 subscribed')
      subscriber.next(1)
      log.push('1 emitted')
      return () => {
        log.push('1 unsubscribed')
      }
    })

    const observable2 = new Observable<number>(subscriber => {
      log.push('2 subscribed');
      (async () => {
        await latency(10)
        subscriber.next(2)
        log.push('2 emitted')
      })()
      return () => {
        log.push('2 unsubscribed')
      }
    })

    const props: { observable: Observable<any> } = {
      observable: observable1
    }

    const { result, rerender, waitForNextUpdate } = renderHook(() => useSnapshot(props.observable))
    expect(result.current).toEqual([1, SnapshotState.EMITTING, null])
    expect(log).toEqual(['1 subscribed', '1 emitted'])

    props.observable = observable2
    rerender()
    expect(result.current).toEqual([null, SnapshotState.WAITING, null])
    expect(log).toEqual(['1 subscribed', '1 emitted', '1 unsubscribed', '2 subscribed'])

    await waitForNextUpdate()
    expect(log).toEqual(['1 subscribed', '1 emitted', '1 unsubscribed', '2 subscribed', '2 emitted'])
    expect(result.current).toEqual([2, SnapshotState.EMITTING, null])
  })

  it('unsubscribes before emit', async () => {
    const log: string[] = []

    const observable = new Observable<number>(subscriber => {
      log.push('subscribed');
      (async () => {
        await latency(10)
        act(() => {
          subscriber.next(1)
          log.push('emitted')
        })
      })()
      return () => {
        log.push('unsubscribed')
      }
    })

    const props: { observable: Observable<any> | null } = {
      observable: observable
    }

    const { result, rerender } = renderHook(() => useSnapshot(props.observable))
    expect(result.current).toEqual([null, SnapshotState.WAITING, null])
    expect(log).toEqual(['subscribed'])

    await latency(1)

    props.observable = null
    rerender()

    expect(result.current).toEqual([null, null, null])
    expect(log).toEqual(['subscribed', 'unsubscribed'])

    await latency(20)

    expect(result.current).toEqual([null, null, null])
    expect(log).toEqual(['subscribed', 'unsubscribed', 'emitted'])
  })
})
