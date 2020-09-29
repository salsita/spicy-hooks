import { MutableRefObject, useRef } from 'react'

/**
 * Use a ref of the latest value passed to the `useUpdatedRef` hook.
 *
 * @param value new value to update the captured one
 */
export function useUpdatedRef<T> (value: T): MutableRefObject<T> {
  const ref = useRef<T>(value)
  ref.current = value
  return ref
}
