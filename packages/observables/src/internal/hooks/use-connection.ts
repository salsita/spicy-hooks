import { ConnectableObservable } from 'rxjs'
import { useEffect } from 'react'

/**
 * A simple helper that connects to a `ConnectableObservable`
 * and disconnects when the component unmounts.
 *
 * This is a safe way to turn a cold observable hot without risking memory leaks.
 *
 * @param observable source observable to connect to
 * @category Hook
 */
export function useConnection (observable: ConnectableObservable<any> | null | undefined): void {
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
