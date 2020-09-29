import { useRef } from 'react'

export type EqualityFunction<T> = (prev: T, next: T) => boolean

/**
 * Returns a `1` based number that increments each time the value changes from the previous.
 *
 * This is useful if you have a complex object that is not instance stable and you want to use
 * it as a dependency for `useMemo` or `useEffect`.
 *
 * @param value value that is expected to change
 * @param equalityFn function to evaluate whether the value changed
 */
export function useValueVersion<T> (value: T, equalityFn: EqualityFunction<T>): number {
  const versionRef = useRef(1)
  const lastValueRef = useRef(value)
  if (!equalityFn(lastValueRef.current, value)) {
    versionRef.current++
  }
  lastValueRef.current = value
  return versionRef.current
}
