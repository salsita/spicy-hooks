import { useComputedRef } from './use-computed-ref'

/**
 * Returns a value computed during the first render using the provided factory.
 * The value is guaranteed to never change.
 */
export function useSingleton<T> (factory: () => T): T {
  const ref = useComputedRef(factory)
  return ref.current
}
