import { useRef } from 'react'

/**
 * A simple function that should return `true` if the two arguments are considered equal, `false` otherwise.
 * The requirements for "equality" are entirely up to the implementation.
 */
export type EqualityFunction<T> = (prev: T, next: T) => boolean

/**
 * Returns a `1` based number that increments each time the value changes from the previous.
 *
 * This is useful if you have a complex object that is not instance stable and you want to use
 * it as a dependency for `useMemo` or `useEffect`.
 *
 * @param value value that is expected to change
 * @param equalityFn function to evaluate whether the value changed
 * @typeParam T type of the observed value
 * @returns `1` based running version of the value
 * @category Hook
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
