import { EMPTY, merge, of, Subject } from 'rxjs'
import { catchError, delay, map, mergeAll, tap, toArray } from 'rxjs/operators'
import { latency } from '@spicy-hooks/utils'

import { createAsyncObservable } from '../utils'
import { concurrentOne } from './concurrent-one'
import { bind } from './bind'
import { coldFrom } from './cold-from'

describe('concurrentOne', () => {
  it('doesn\'t run an observable when there is one pending already', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 10, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(5))
    )

    await higherOrderObservable.pipe(
      concurrentOne(),
      mergeAll(),
      tap(value => log.push(`received ${value}`))
    ).toPromise()

    expect(log).toEqual([
      'start 1',
      'emit 1',
      'received 1',
      'complete 1',
      'after complete 1'
    ])
  })

  it('runs next when previous is already finished', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 3, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(10))
    )

    await higherOrderObservable.pipe(
      concurrentOne(),
      mergeAll(),
      tap(value => log.push(`received ${value}`))
    ).toPromise()

    expect(log).toEqual([
      'start 1',
      'emit 1',
      'received 1',
      'complete 1',
      'after complete 1',
      'start 2',
      'emit 2',
      'received 2',
      'complete 2',
      'after complete 2'
    ])
  })

  it('emits nested observables (published)', async () => {
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 10)),
      of(createAsyncObservable(2, 5)).pipe(delay(5)),
      of(createAsyncObservable(3, 5)).pipe(delay(12))
    )

    const values = await higherOrderObservable.pipe(
      concurrentOne(),
      mergeAll(),
      toArray()
    ).toPromise()

    expect(values).toEqual([1, 3])
  })

  it('recovers from failure of a nested observable', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(-1, 5, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(10))
    )

    await higherOrderObservable.pipe(
      concurrentOne(),
      map(observable => observable.pipe(
        catchError(error => {
          log.push(error)
          return EMPTY
        })
      )),
      mergeAll(),
      tap(value => log.push(`received ${value}`))
    ).toPromise()

    expect(log).toEqual([
      'start -1',
      'fail -1',
      'error -1',
      'start 2',
      'emit 2',
      'received 2',
      'complete 2',
      'after complete 2'
    ])
  })

  it('unsubscribes from source when unsubscribed from (without emission)', () => {
    const subject = new Subject<number>()

    const pipeLine = subject.pipe(
      bind(async (i) => {
        await latency(50)
        return `i: ${i}`
      }),
      coldFrom(),
      concurrentOne()
    )

    expect(subject.observers.length).toBe(0)

    const subscription = pipeLine.subscribe({ next: () => undefined })

    expect(subject.observers.length).toBe(1)

    subscription.unsubscribe()

    expect(subject.observers.length).toBe(0)
  })

  it('unsubscribes from source when unsubscribed from (wit emission)', () => {
    const subject = new Subject<number>()

    const pipeLine = subject.pipe(
      bind(async (i) => {
        await latency(50)
        return `i: ${i}`
      }),
      coldFrom(),
      concurrentOne()
    )

    const subscription = pipeLine.subscribe({ next: () => undefined })

    subject.next(1)

    subscription.unsubscribe()
    expect(subject.observers.length).toBe(0)
  })
})
