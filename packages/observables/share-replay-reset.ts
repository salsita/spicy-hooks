import { OperatorFunction, pipe, ReplaySubject } from 'rxjs'
import { multicast, refCount } from 'rxjs/operators'

/**
 * Works just like `shareReplay(1)`, but makes sure that it completely resets after all subscribers are gone.
 */
export function shareReplayReset<T> (): OperatorFunction<T, T> {
  return pipe(
    multicast(() => new ReplaySubject<T>(1)),
    refCount()
  )
}
