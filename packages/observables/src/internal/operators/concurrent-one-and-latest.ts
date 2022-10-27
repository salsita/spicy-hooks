import { ConnectableObservable, EMPTY, noop, Observable, OperatorFunction } from 'rxjs'
import { publish } from 'rxjs/operators'

/**
 * Ensures that the first emitted observable will become *hot*. Latest succeeding emitted observable is queued until previous completes.
 * Any further emitted observable replaces the previously queued one.
 *
 * The observables are emitted as soon as they become *hot*.
 *
 * @typeParam T type of both the accepted and emitted observable
 * @category Operator
 */
export function concurrentOneAndLatest<T> (): OperatorFunction<Observable<T>, Observable<T>> {
  return source => new Observable(subscriber => {
    let pending$: Observable<T> | null = null

    let next$: ConnectableObservable<T> | null = null

    const startNextIfPresent = () => {
      if (next$) {
        const current$ = next$
        next$ = null
        pending$ = current$
        const connection = current$.connect()
        current$.toPromise().finally(() => {
          connection.unsubscribe()
          if (pending$ === current$) {
            pending$ = null
          }
          startNextIfPresent()
        }).catch(noop)
        subscriber.next(current$)
      } else {
        pending$ = null
      }
    }

    return source.subscribe({
      next: observable => {
        next$ = publish<T>()(observable)
        if (!pending$) {
          startNextIfPresent()
        }
      },
      error: err => subscriber.error(err),
      complete: () => {
        (next$ ?? pending$ ?? EMPTY).toPromise().finally(() => {
          subscriber.complete()
        }).catch(noop)
      }
    })
  })
}
