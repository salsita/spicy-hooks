import { useComputedRef } from './use-computed-ref'

/**
 * Returns a value computed during the first render using the provided factory.
 * The value is guaranteed to never change.
 *
 * @param factory factory function to generate the singleton value on the first render (ignored for any subsequent render)
 * @typeParam T type of the generated value
 * @category Hook
 */
export function useSingleton<T> (factory: () => T): T {
  const ref = useComputedRef(factory)
  return ref.current
}
