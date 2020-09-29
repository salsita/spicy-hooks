import { RefObject, useRef } from 'react'
import { Observable } from 'rxjs'

import { useSubscription } from './use-subscription'

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
