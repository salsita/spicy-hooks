import { DependencyList, useEffect, useState } from 'react'
import { from } from 'rxjs'

import { Snapshot, useSnapshot } from './use-snapshot'
import { useGuaranteedMemo } from '../react'

/**
 * Async version of `useMemo` where the factory is supposed to return a promise.
 * The hook returns a snapshot of the promise as if it was an observable.
 *
 * @param factory async factory
 * @param deps dependencies of the async factory
 * @see [[useSnapshot]]
 */
export function useAsyncMemo<T> (factory: () => Promise<T>, deps: DependencyList): Snapshot<T | null, null> {
  const [promise, setPromise] = useState<Promise<T>>()
  useEffect(
    () => setPromise(factory()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  )
  const observable = useGuaranteedMemo(() => promise && from(promise), [promise])
  return useSnapshot(observable)
}
