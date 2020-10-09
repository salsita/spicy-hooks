import { EMPTY, noop, Observable, OperatorFunction } from 'rxjs'
import { publish } from 'rxjs/operators'

/**
 * Queues all incoming observable and turns each of them *hot* after the previous completes.
 *
 * The observables are emitted as soon as they become *hot*.
 *
 * @typeParam T type of both the accepted and emitted observable
 * @category Operator
 */
export function concurrentQueue<T> (): OperatorFunction<Observable<T>, Observable<T>> {
  return source => new Observable(subscriber => {
    let tail$: Observable<T> = EMPTY
    source.subscribe({
      next: async observable => {
        const previous$ = tail$
        const current$ = publish<T>()(observable)
        tail$ = current$
        try {
          await previous$.toPromise()
        } catch (ignored) {
          // we treat error as completion
        }
        const connection = current$.connect()
        subscriber.next(current$)
        current$.toPromise().finally(() => {
          connection.unsubscribe()
          if (tail$ === current$) {
            tail$ = EMPTY
          }
        }).catch(noop)
      },
      error: err => subscriber.error(err),
      complete: () => tail$.toPromise().finally(() => subscriber.complete()).catch(noop)
    })
  })
}
