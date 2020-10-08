import { Observable, PartialObserver } from 'rxjs'
import { DependencyList, useEffect } from 'react'

/**
 * A simple helper that subscribes to the observable with the provided observer,
 * optionally resubscribes whenever any of the `deps` changes, and finally unsubscribes
 * when the component unmounts.
 *
 * @param observable source observable to subscribe to
 * @param observer observer to subscribe with
 * @param deps dependencies of the observer
 * @typeParam T type of the emission of the observable we are subscribing to
 * @category Hook
 */
export function useSubscription<T> (observable: Observable<T> | null | undefined, observer: PartialObserver<T> | null | undefined, deps: DependencyList) {
  useEffect(
    () => {
      if (!observable || !observer) {
        return
      }
      const subscription = observable.subscribe(observer)
      return () => subscription.unsubscribe()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [observable, ...deps]
  )
}
