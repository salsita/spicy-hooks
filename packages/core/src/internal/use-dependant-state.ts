import { DependencyList, Dispatch, SetStateAction, useRef } from 'react'
import { isFunction, isEqualArray } from '@spicy-hooks/utils'

import { useStateWithoutRerender } from './use-state-without-rerender'

/**
 * An extension to the `useState` hook which resets the current value to the `initialValue` every time the `deps` change.
 *
 * @param initialValue initial value or a factory to generate one
 * @param deps array of dependencies
 * @returns the same result as obtained from `useState`
 * @typeParam S type of the state value
 * @category Hook
 */
export function useDependantState<S> (initialValue: S | (() => S), deps: DependencyList): [S, Dispatch<SetStateAction<S>>] {
  const [value, setValue, silentlySetValue] = useStateWithoutRerender<S>(initialValue)
  const lastDepsRef = useRef(deps)
  if (isEqualArray(deps, lastDepsRef.current)) {
    lastDepsRef.current = deps
    return [value, setValue]
  } else {
    const newValue =
      isFunction(initialValue)
        ? initialValue()
        : initialValue
    silentlySetValue(newValue)
    lastDepsRef.current = deps
    return [newValue, setValue]
  }
}
