import { useRef } from 'react'

/**
 * A simple function that should return `true` if the two arguments are considered equal, `false` otherwise.
 * The requirements for "equality" are entirely up to the implementation.
 */
export type EqualityFunction<T> = (prev: T, next: T) => boolean

/**
 * Returns always the same instance of the `value` until it changes according to the `equalityFn`.
 * Useful for keeping stable instance of objects whose instances change, but values stay the same.
 *
 * @param value value that is expected to change
 * @param equalityFn function to evaluate whether the value changed
 * @typeParam T type of the interned value
 * @category Hook
 */
export function useDistinctValue<T> (value: T, equalityFn: EqualityFunction<T>): T {
  const distinctValueRef = useRef(value)
  if (!equalityFn(distinctValueRef.current, value)) {
    distinctValueRef.current = value
  }
  return distinctValueRef.current
}
