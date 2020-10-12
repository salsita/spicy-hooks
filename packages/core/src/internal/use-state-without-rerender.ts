import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { isFunction } from '@spicy-hooks/utils'

import { useUpdatedRef } from './use-updated-ref'

interface ValueHolder<T> {
  value: T
}

/**
 * Extends the standard `useState` hook with an ability to modify the state without
 * triggering re-rendering of the component.
 * The hook returns an array of the following shape:
 * ```javascript
 * [value, setValue, silentlySetValue]
 * ```
 * The first two elements work exactly the same way as the ones returned from `useState` while the
 * third element is a callback that updates the state value without re-rendering the host component.
 *
 * **Warning**: The main use-case for `useStateWithoutRerender` is for derived state where using plain `setState`
 * would incur unnecessary re-rendering. Using it for any other purpose usually signalizes wrong flow
 * in your application state and will most likely cause weird side-effects since it can de-synchronize
 * the application and UI states.
 *
 * **Note:** When you're reading this, you probably just need the higher level `useDependantState` instead which
 * lets you reset the state when dependencies change while making sure that UI and app states are in sync.
 *
 * @param initialValue initial value or a function returning it
 * @returns [value, setValue, silentlySetValue]
 * @typeParam S type of the state value
 * @internal
 */
export function useStateWithoutRerender<S> (initialValue: S | (() => S)): [S, Dispatch<SetStateAction<S>>, Dispatch<SetStateAction<S>>] {
  const [holder, setHolder] = useState<ValueHolder<S>>(
    isFunction(initialValue)
      ? () => ({ value: initialValue() })
      : { value: initialValue }
  )

  const latestHolderRef = useUpdatedRef(holder)

  const setValue: Dispatch<SetStateAction<S>> = useCallback(
    valueOrUpdater => {
      setHolder(prevHolder => {
        const newValue =
          isFunction(valueOrUpdater)
            ? valueOrUpdater(prevHolder.value)
            : valueOrUpdater
        const newHolder =
          prevHolder.value === newValue
            ? prevHolder
            : { value: newValue }

        latestHolderRef.current = newHolder
        return newHolder
      })
    },
    [setHolder, latestHolderRef]
  )

  const silentlySetValue: Dispatch<SetStateAction<S>> = useCallback(
    valueOrUpdater => {
      latestHolderRef.current.value =
        isFunction(valueOrUpdater)
          ? valueOrUpdater(latestHolderRef.current.value)
          : valueOrUpdater
    },
    [latestHolderRef]
  )

  return [holder.value, setValue, silentlySetValue]
}
