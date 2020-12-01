import { merge, of, Subject } from 'rxjs'
import { delay, mergeAll, tap, toArray } from 'rxjs/operators'
import { latency } from '@spicy-hooks/utils'

import { createAsyncObservable } from '../utils'
import { coldFrom } from './cold-from'
import { bind } from './bind'
import { concurrentOneAndLatest } from './concurrent-one-and-latest'

describe('concurrentOneAndLatest', () => {
  it('doesn\'t subscribe to next until the first observable completes', async () => {
    const log: string[] = []
    const higherOrderObservable = of(
      createAsyncObservable(1, 5, log),
      createAsyncObservable(2, 5, log)
    )

    await higherOrderObservable.pipe(
      concurrentOneAndLatest(),
      tap(() => log.push('nested observable emitted')),
      mergeAll(),
      tap(value => log.push(`received ${value}`))
    ).toPromise()

    expect(log).toEqual([
      'start 1',
      'nested observable emitted',
      'emit 1',
      'received 1',
      'complete 1',
      'after complete 1',
      'start 2',
      'nested observable emitted',
      'emit 2',
      'received 2',
      'complete 2',
      'after complete 2'
    ])
  })

  it('queues only the latest emitted observable while the first one is still pending', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 15, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(5)),
      of(createAsyncObservable(3, 5, log)).pipe(delay(10))
    )

    await higherOrderObservable.pipe(
      concurrentOneAndLatest(),
      tap(() => log.push('nested observable emitted')),
      mergeAll(),
      tap(value => log.push(`received ${value}`))
    ).toPromise()

    expect(log).toEqual([
      'start 1',
      'nested observable emitted',
      'emit 1',
      'received 1',
      'complete 1',
      'after complete 1',
      'start 3',
      'nested observable emitted',
      'emit 3',
      'received 3',
      'complete 3',
      'after complete 3'
    ])
  })

  it('resets when the "queue" is emptied', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 5, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(10)),
      of(createAsyncObservable(3, 5, log)).pipe(delay(15))
    )

    await higherOrderObservable.pipe(
      concurrentOneAndLatest(),
      tap(() => log.push('nested observable emitted')),
      mergeAll(),
      tap(value => log.push(`received ${value}`))
    ).toPromise()

    expect(log).toEqual([
      'start 1',
      'nested observable emitted',
      'emit 1',
      'received 1',
      'complete 1',
      'after complete 1',
      'start 2',
      'nested observable emitted',
      'emit 2',
      'received 2',
      'complete 2',
      'after complete 2',
      'start 3',
      'nested observable emitted',
      'emit 3',
      'received 3',
      'complete 3',
      'after complete 3'
    ])
  })

  it('runs next when previous is already finished', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 3, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(10))
    )

    await higherOrderObservable.pipe(
      concurrentOneAndLatest()
    ).toPromise()

    expect(log).toEqual([
      'start 1',
      'emit 1',
      'complete 1',
      'after complete 1',
      'start 2',
      'emit 2',
      'complete 2',
      'after complete 2'
    ])
  })

  it('emits nested observables (published)', async () => {
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 10)),
      of(createAsyncObservable(2, 5)).pipe(delay(3)),
      of(createAsyncObservable(3, 5)).pipe(delay(5))
    )

    const values = await higherOrderObservable.pipe(
      concurrentOneAndLatest(),
      mergeAll(),
      toArray()
    ).toPromise()

    expect(values).toEqual([1, 3])
  })

  it('moves to next observable if one fails', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(-1, 10, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(3))
    )

    await higherOrderObservable.pipe(
      concurrentOneAndLatest()
    ).toPromise()

    expect(log).toEqual([
      'start -1',
      'fail -1',
      'start 2',
      'emit 2',
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
      concurrentOneAndLatest()
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
      concurrentOneAndLatest()
    )

    const subscription = pipeLine.subscribe({ next: () => undefined })

    subject.next(1)

    subscription.unsubscribe()
    expect(subject.observers.length).toBe(0)
  })
})
