import { RefObject, useRef } from 'react'
import { Observable } from 'rxjs'

import { useSubscription } from './use-subscription'

/**
 * Returns a `ref` object whose `current` value is always the latest value emitted by the provided observable.
 *
 * Note that if the observable changes, the value is not reset. Therefore if the new observable is asynchronous,
 * the ref will still have value of the previous observable until the new one emits.
 *
 * @param observable observable to subscribe to and whose emissions should be kept in the ref
 * @param initialValue an initial value of the ref to be used while waiting for the observable to emit (if it is async)
 * @typeParam T type of the emitted value
 * @category Hook
 */
export function useLastEmitRef<T> (observable: Observable<T>, initialValue: T): RefObject<T> {
  const ref = useRef(initialValue)
  useSubscription(
    observable,
    {
      next: value => {
        ref.current = value
      }
    },
    [ref]
  )
  return ref
}
