import { merge, of } from 'rxjs'
import { delay, mergeAll, tap, toArray } from 'rxjs/operators'
import { latency } from '@spicy-hooks/utils'

import { concurrentQueue } from './concurrent-queue'
import { bind } from './bind'
import { coldFrom } from './cold-from'
import { createAsyncObservable } from '../utils'

describe('concurrentQueue', () => {
  it('subscribes to async cold observables one by one', async () => {
    const log: string[] = []
    const higherOrderObservable = of(
      createAsyncObservable(1, 5, log),
      createAsyncObservable(2, 10, log),
      createAsyncObservable(3, 5, log)
    )

    await higherOrderObservable.pipe(
      concurrentQueue(),
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

  it('queues next while previous is pending', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 10, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(5))
    )

    await higherOrderObservable.pipe(
      concurrentQueue()
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

  it('runs next when previous is already finished', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 3, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(10))
    )

    await higherOrderObservable.pipe(
      concurrentQueue()
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
    const higherOrderObservable = of(
      createAsyncObservable(1, 10),
      createAsyncObservable(2, 5)
    )

    const values = await higherOrderObservable.pipe(
      concurrentQueue(),
      mergeAll(),
      toArray()
    ).toPromise()

    expect(values).toEqual([1, 2])
  })

  it('works with async functions', async () => {
    const log: string[] = []

    const higherOrderObservable = of(1, 2).pipe(
      bind(async num => {
        log.push(`start ${num}`)
        await latency(5)
        log.push(`complete ${num}`)
        return `num: ${num}`
      }),
      coldFrom()
    )

    await higherOrderObservable
      .pipe(
        concurrentQueue(),
        mergeAll(),
        tap(value => log.push(value))
      )
      .toPromise()

    expect(log).toEqual([
      'start 1',
      'complete 1',
      'num: 1',
      'start 2',
      'complete 2',
      'num: 2'
    ])
  })

  it('moves to next observable if one fails', async () => {
    const log: string[] = []
    const higherOrderObservable = of(
      createAsyncObservable(-1, 5, log),
      createAsyncObservable(2, 5, log)
    )

    await higherOrderObservable.pipe(
      concurrentQueue()
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
})
