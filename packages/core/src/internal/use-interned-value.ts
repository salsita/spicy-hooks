import { useMemo } from 'react'

import { EqualityFunction, useValueVersion } from './use-value-version'

/**
 * Returns always the same instance of the `value` until it changes according to the `equalityFn`.
 * Useful for keeping stable instance of objects whose instances change, but values stay the same.
 *
 * @param value value that is expected to change
 * @param equalityFn function to evaluate whether the value changed
 */
export function useInternedValue<T> (value: T, equalityFn: EqualityFunction<T>): T {
  const version = useValueVersion(value, equalityFn)
  return useMemo(
    () => value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version]
  )
}
