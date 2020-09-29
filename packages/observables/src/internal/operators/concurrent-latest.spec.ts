import { EMPTY, merge, of } from 'rxjs'
import { catchError, delay, map, mergeAll, tap, toArray } from 'rxjs/operators'

import { createAsyncObservable } from '../utils'
import { concurrentLatest } from './concurrent-latest'

describe('concurrentLatest', () => {
  it('subscribes to each emitted observable', async () => {
    const log: string[] = []
    const higherOrderObservable = of(
      createAsyncObservable(1, 5, log),
      createAsyncObservable(2, 10, log),
      createAsyncObservable(3, 7, log)
    )

    await higherOrderObservable.pipe(
      concurrentLatest()
    ).toPromise()

    expect(log).toEqual([
      'start 1',
      'start 2',
      'start 3',
      'emit 1',
      'complete 1',
      'after complete 1',
      'emit 3',
      'complete 3',
      'after complete 3'

      // we don't see completion of observable 2 as if finishes after
      // observable 3 which is the only one `concurrentLatest` cares about
    ])
  })

  it('unsubscribes from the pending observable when next arrives', async () => {
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 10)),
      of(createAsyncObservable(2, 5)).pipe(delay(5))
    )
    const receive = jest.fn()

    await higherOrderObservable.pipe(
      concurrentLatest(),
      mergeAll(),
      tap(receive)
    ).toPromise()

    expect(receive).toHaveBeenCalledTimes(1)
    expect(receive).toHaveBeenCalledWith(2)
  })

  it('runs next when previous is already finished', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 3, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(10))
    )

    await higherOrderObservable.pipe(
      concurrentLatest(),
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
      of(createAsyncObservable(1, 5)),
      of(createAsyncObservable(2, 5)).pipe(delay(10)),
      of(createAsyncObservable(3, 5)).pipe(delay(12))
    )

    const values = await higherOrderObservable.pipe(
      concurrentLatest(),
      mergeAll(),
      toArray()
    ).toPromise()

    expect(values).toEqual([1, 3])
  })

  it('recovers from failure of a nested observable (which comes after unsubscribe)', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(-1, 15, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(3))
    )

    await higherOrderObservable.pipe(
      concurrentLatest(),
      mergeAll(),
      tap(value => log.push(`received ${value}`))
    ).toPromise()

    expect(log).toEqual([
      'start -1',
      'start 2',
      'emit 2',
      'received 2',
      'complete 2',
      'after complete 2'
    ])
  })

  it('recovers from failure of a nested observable (which comes before unsubscribe)', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(-1, 5, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(15))
    )

    await higherOrderObservable.pipe(
      concurrentLatest(),
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

  it('can interrupt pending task with an error', async () => {
    const log: string[] = []
    const higherOrderObservable = merge(
      of(createAsyncObservable(1, 10, log)),
      of(createAsyncObservable(2, 5, log)).pipe(delay(5))
    )

    await higherOrderObservable
      .pipe(
        concurrentLatest('Cancelled due to a later request'),
        map(observable => observable.pipe(
          catchError(error => {
            log.push(error)
            return EMPTY
          })
        )),
        mergeAll(),
        tap(value => log.push(`received ${value}`))
      )
      .toPromise()

    expect(log).toEqual([
      'start 1',
      'Cancelled due to a later request',
      'start 2',
      'emit 1',
      'complete 1',
      'after complete 1',
      'emit 2',
      'received 2',
      'complete 2',
      'after complete 2'
    ])
  })
})
