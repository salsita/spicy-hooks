import { useRef } from 'react'

/**
 * Caches previous `value` for usages when current `value` is not available.
 * Availability of `value` is by default determined using `value != null`.
 * If more specific control is required, the second argument is here to the rescue.
 * Passing `true` to `isAvailable` marks the provided `value` as available,
 * while `false` will make the function return the cached one.
 *
 * This hook is useful to keep invalidated values around until a new valid one is obtained.
 *
 * @param value value to be cached
 * @param isAvailable optional custom boolean flag to determine "availability"
 * @returns either cached or the provided `value`, based on availability
 * @typeParam T type of the cached value
 * @category Hook
 */
export function useLastAvailable<T> (value: T, isAvailable = value != null): T {
  const lastValueRef = useRef(value)

  if (isAvailable) {
    lastValueRef.current = value
    return value
  } else {
    return lastValueRef.current
  }
}
