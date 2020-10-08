import { MutableRefObject, RefCallback, useCallback } from 'react'
import { isFunction } from '@spicy-hooks/utils'

/**
 * Aggregates multiple `ref`s into a single one, so that multiple `ref`s can be attached to a single element.
 *
 * @typeParam T type of the value kept in the ref
 * @category Hook
 */
export function useCombinedRef<T> (...refs: Array<RefCallback<T> | MutableRefObject<T | null> | null | undefined>): RefCallback<T> {
  return useCallback(
    element => {
      refs.forEach(ref => {
        if (!ref) {
          return
        }
        if (isFunction(ref)) {
          ref(element)
        } else {
          ref.current = element
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  )
}
