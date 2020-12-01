import { EMPTY, noop, Observable, OperatorFunction } from 'rxjs'
import { publish } from 'rxjs/operators'

/**
 * Turns the first incoming observable *hot* and ignores any further observable
 * until the first completes (or fails). Once that happens the operator is ready
 * to accept new observables.
 *
 * The *hot* observables are emitted, the others not.
 *
 * @typeParam T type of both the accepted and emitted observable
 * @category Operator
 */
export function concurrentOne<T> (): OperatorFunction<Observable<T>, Observable<T>> {
  return source => new Observable(subscriber => {
    let pending$: Observable<T> | null = null

    return source.subscribe({
      next: async observable => {
        if (pending$) {
          return
        }

        const current$ = publish<T>()(observable)
        pending$ = current$
        const connection = current$.connect()
        current$.toPromise().finally(() => {
          connection.unsubscribe()
          if (pending$ === current$) {
            pending$ = null
          }
        }).catch(noop)
        subscriber.next(current$)
      },
      error: err => subscriber.error(err),
      complete: () => (pending$ ?? EMPTY).toPromise().finally(() => subscriber.complete()).catch(noop)
    })
  })
}
