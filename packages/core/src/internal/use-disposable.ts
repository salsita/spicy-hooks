import { DependencyList, useRef } from 'react'

import { useImmediateEffect } from './use-immediate-effect'

/**
 * Allows you allocate resources synchronously while ensuring they will be properly disposed when the
 * `deps` change or when the component gets unmounted.
 *
 * Works just like `useMemo` with the addition of the dispose callback.
 *
 * Note that it is ensured that the previous allocated value will be disposed prior allocating a new one.
 *
 * @param factory factory function that returns a tuple of the allocated value and a dispose callback
 * @param deps dependencies of the factory function
 * @typeParam T type of the allocated value
 * @returns the allocated value
 * @category Hook
 */
export function useDisposable<T> (factory: () => [T, () => void], deps: DependencyList): T {
  const ref = useRef<T>()
  useImmediateEffect(
    () => {
      const [value, dispose] = factory()
      ref.current = value
      return dispose
    },
    deps
  )
  return ref.current!
}
