import { ConnectableObservable } from 'rxjs'
import { useEffect } from 'react'

/**
 * A simple helper that connects to a `ConnectableObservable`
 * and disconnects when the component unmounts.
 *
 * @param observable source observable to connect to
 */
export function useConnection<T> (observable: ConnectableObservable<T> | null | undefined): void {
  useEffect(
    () => {
      if (!observable) {
        return
      }
      const connection = observable.connect()
      return () => connection.unsubscribe()
    },
    [observable]
  )
}
