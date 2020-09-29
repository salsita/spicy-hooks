import { EMPTY, noop, Observable, OperatorFunction, Subject, Subscription } from 'rxjs'
import { multicast } from 'rxjs/operators'

/**
 * Subscribes to any emitted observable, but "cancels" it immediately when another one arrives.
 * _Canceling_ means:
 * * the source observable is immediately unsubscribed from
 * * the re-emitted hot observable is completed or failed (if `cancelError` is specified and different from `undefined`)
 *
 * The observables re-emitted immediately as *hot*.
 *
 * **Warning:** The source observable is always subscribed to, therefore this concurrency strategy cannot prevent eventual side-effects when cancelling.
 *
 * @param cancelError when provided the re-emitted observable will throw the provided error instead of completing when it is cancelled
 */
export function concurrentLatest<T> (cancelError?: any): OperatorFunction<Observable<T>, Observable<T>> {
  return source => new Observable(subscriber => {
    let pendingConnection: Subscription | null = null
    let pending$: Observable<T> = EMPTY
    let pendingSubject: Subject<T> | null = null

    source.subscribe({
      next: observable => {
        if (pendingSubject) {
          if (cancelError !== undefined) {
            pendingSubject.error(cancelError)
          } else {
            pendingSubject.complete()
          }
          pendingSubject = null
        }
        if (pendingConnection) {
          pendingConnection.unsubscribe()
          pendingConnection = null
        }
        const subject = new Subject<T>()
        pendingSubject = subject

        const current$ = multicast<T>(() => subject)(observable)
        pending$ = current$

        const connection = current$.connect()
        pendingConnection = connection

        current$.toPromise().finally(() => {
          connection.unsubscribe()
          if (pendingConnection === connection) {
            pendingConnection = null
            pending$ = EMPTY
            pendingSubject = null
          }
        }).catch(noop)
        subscriber.next(current$)
      },
      error: err => subscriber.error(err),
      complete: () => pending$.toPromise().finally(() => subscriber.complete()).catch(noop)
    })
  })
}
