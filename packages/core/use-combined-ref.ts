import { MutableRefObject, RefCallback, useCallback } from 'react'

import { isFunction } from '../../common'

/**
 * Aggregates multiple `ref`s into a single one, so that multiple `ref`s can be attached to a single element.
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
